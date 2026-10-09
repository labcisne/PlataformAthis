#!/usr/bin/env node

const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const crypto = require('node:crypto');
const dotenv = require('dotenv');
const XLSX = require('xlsx');
const prisma = require('../Utils/prisma');
const AppSheetImageSource = require('../Services/appsheet/AppSheetImageSource');
const MinioStorageService = require('../Services/storage/MinioStorageService');

dotenv.config({ path: path.resolve(__dirname, '../config.env') });

const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_CONCURRENCY = 3;
const DEFAULT_RETRIES = 2;
const REPORT_PATH = path.resolve(__dirname, '../migration-images-report.json');
const LOCK_PATH = path.resolve(__dirname, '../migration-images.lock');

function argumentValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function numberArgument(name, fallback, maximum) {
  const value = Number(argumentValue(name, fallback));
  return Number.isInteger(value) && value > 0 && value <= maximum ? value : fallback;
}

function extensionFor(file) {
  const fromName = path.extname(file.originalName || '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  if (fromName) return fromName;
  const byMime = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/heic': '.heic'
  };
  return byMime[file.mimeType] || '.bin';
}

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function redact(message) {
  const secretNames = [
    'APPSHEET_APPLICATION_ACCESS_KEY',
    'MINIO_SECRET_KEY',
    'MINIO_ACCESS_KEY',
    'DATABASE_URL',
    'SECRET_STR'
  ];
  return secretNames.reduce((result, name) => {
    const value = process.env[name];
    return value ? result.replaceAll(value, `[redacted:${name}]`) : result;
  }, String(message));
}

async function withRetries(operation, retries) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise(resolve => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function verifyObject(storage, storageKey, expected = {}) {
  const url = await storage.getPresignedUrl(storageKey, 300);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Objeto retornou HTTP ${response.status}`);
  const content = Buffer.from(await response.arrayBuffer());
  if (!content.length) throw new Error('Objeto vazio no MinIO');
  const actual = { size: content.length, hash: hash(content) };
  if (expected.size != null && actual.size !== expected.size) throw new Error('Tamanho do objeto diverge dos metadados');
  if (expected.hash && actual.hash !== expected.hash) throw new Error('SHA-256 do objeto diverge dos metadados');
  return actual;
}

function storageKeyFor(image, original) {
  return image.storageKey || `families/${image.edificacao.familyId}/edificacoes/${image.edificacao.id}/images/${image.id}${extensionFor(original)}`;
}

async function auditSpreadsheet(filePath, images) {
  if (!fs.existsSync(filePath)) return { filledPaths: 0, missingPaths: 0, examples: [], unavailable: true };
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const missing = [];
  const spreadsheetIds = new Set();
  const spreadsheetPathsById = new Map();
  let filledPaths = 0;
  for (const sheetName of workbook.SheetNames.filter(name => name.startsWith('Fotos_'))) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' });
    const headers = rows[0] || [];
    const pathIndex = headers.findIndex(value => String(value).trim().toLowerCase() === 'foto:');
    const sourceIndex = headers.findIndex(value => String(value).trim().toLowerCase().startsWith('id'));
    if (pathIndex < 0) continue;
    for (const row of rows.slice(1)) {
      const sourcePath = String(row[pathIndex] || '').trim();
      if (!sourcePath) continue;
      filledPaths += 1;
      const sourceId = String(row[sourceIndex] || '').trim();
      if (!sourceId) {
        missing.push({ sourceId: null, sourcePath, reason: 'Caminho sem ID de origem' });
        continue;
      }
      spreadsheetIds.add(sourceId);
      if (!spreadsheetPathsById.has(sourceId)) spreadsheetPathsById.set(sourceId, new Set());
      spreadsheetPathsById.get(sourceId).add(sourcePath);
    }
  }
  const dbOnly = [];
  const pathMismatches = [];
  for (const image of images) {
    const sourceId = image.appsheetSourceId;
    if (!sourceId || !spreadsheetIds.has(sourceId)) {
      dbOnly.push({ imageId: image.id, sourceId: sourceId || null, sourcePath: image.foto || null });
      continue;
    }
    const spreadsheetPaths = spreadsheetPathsById.get(sourceId);
    if (image.foto && spreadsheetPaths && !spreadsheetPaths.has(image.foto)) {
      pathMismatches.push({ imageId: image.id, sourceId, dbPath: image.foto, spreadsheetPaths: [...spreadsheetPaths] });
    }
  }
  for (const [sourceId, paths] of spreadsheetPathsById) {
    if (!images.some(image => image.appsheetSourceId === sourceId)) {
      for (const sourcePath of paths) missing.push({ sourceId, sourcePath });
    }
  }
  return {
    filledPaths,
    uniqueSpreadsheetIds: spreadsheetIds.size,
    databaseRecords: images.length,
    databaseRecordsWithoutSourceId: images.filter(image => !image.appsheetSourceId).length,
    spreadsheetOnlyPaths: missing.length,
    databaseOnlyRecords: dbOnly.length,
    pathMismatches: pathMismatches.length,
    examples: [...missing, ...dbOnly, ...pathMismatches].slice(0, 10)
  };
}

let reportWritePromise = Promise.resolve();

function isTransientFileError(error) {
  return ['EPERM', 'EACCES', 'EBUSY', 'ENOTEMPTY'].includes(error.code);
}

async function renameWithRetries(from, to, retries = 3) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      await fsp.rename(from, to);
      return;
    } catch (error) {
      lastError = error;
      if (!isTransientFileError(error) || attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function replaceReportFile(temporaryPath) {
  try {
    await renameWithRetries(temporaryPath, REPORT_PATH);
    return;
  } catch (error) {
    if (!isTransientFileError(error)) throw error;
  }

  const backupPath = `${REPORT_PATH}.${process.pid}.${Date.now()}.bak`;
  let backupCreated = false;
  try {
    await renameWithRetries(REPORT_PATH, backupPath);
    backupCreated = true;
    await renameWithRetries(temporaryPath, REPORT_PATH);
  } catch (error) {
    if (backupCreated) await renameWithRetries(backupPath, REPORT_PATH).catch(() => {});
    throw error;
  }
  await fsp.unlink(backupPath).catch(() => {});
}

async function updateReport(report) {
  const write = async () => {
    const temporaryPath = `${REPORT_PATH}.${process.pid}.tmp`;
    await fsp.writeFile(temporaryPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    try {
      await replaceReportFile(temporaryPath);
    } catch (error) {
      await fsp.unlink(temporaryPath).catch(() => {});
      throw error;
    }
  };
  reportWritePromise = reportWritePromise.catch(() => {}).then(write);
  return reportWritePromise;
}

async function processImage(image, { dryRun, source, storage, retries }) {
  const base = { imageId: image.id, sourceId: image.appsheetSourceId || null };
  if (!image.edificacaoId || !image.edificacao || !image.foto || !image.appsheetSourceId) {
    return { ...base, status: 'validation_error', reason: 'Registro sem foto, edificacao_id, edificacao ou appsheet_source_id obrigatório' };
  }

  if (image.storageKey) {
    try {
      const verified = await withRetries(() => verifyObject(storage, image.storageKey, {
        size: image.tamanho,
        hash: image.hash
      }), retries);
      if (!dryRun && (!image.tamanho || !image.hash)) {
        await prisma.imagem.update({ where: { id: image.id }, data: { tamanho: verified.size, hash: verified.hash } });
      }
      return { ...base, status: 'already_migrated_valid', storageKey: image.storageKey };
    } catch (error) {
      if (dryRun) return { ...base, status: 'validation_error', storageKey: image.storageKey, reason: redact(error.message) };
    }
  }
  if (dryRun) return { ...base, status: image.storageKey ? 'validation_error' : 'pending_migration', storageKey: image.storageKey || null };

  try {
    const original = await withRetries(() => source.resolve(image.foto, image.appsheetSourceId), retries);
    if (!original.content?.length || original.size !== original.content.length) throw new Error('Download vazio ou tamanho inconsistente');
    const originalHash = hash(original.content);
    const storageKey = storageKeyFor(image, original);

    if (image.storageKey) {
      try {
        const current = await verifyObject(storage, storageKey);
        return { ...base, status: 'already_migrated_valid', storageKey, size: current.size };
      } catch (_) {
        // Existing key is missing or inconsistent; recovery below is safe.
      }
    }
    await withRetries(() => storage.uploadFile({
      content: original.content,
      storageKey,
      contentType: original.mimeType,
      size: original.size
    }), retries);
    const verified = await withRetries(() => verifyObject(storage, storageKey, {
      size: original.size,
      hash: originalHash
    }), retries);
    await prisma.imagem.update({
      where: { id: image.id },
      data: {
        storageKey,
        nomeOriginal: original.originalName,
        mimeType: original.mimeType,
        tamanho: verified.size,
        hash: verified.hash
      }
    });
    return { ...base, status: 'migrated', storageKey, size: verified.size };
  } catch (error) {
    return { ...base, status: 'migration_error', reason: redact(error.message) };
  }
}

async function runWorkers(images, options) {
  let next = 0;
  async function worker() {
    while (next < images.length) {
      const image = images[next++];
      const result = await processImage(image, options);
      options.report.results.push(result);
      options.report.counts[result.status] = (options.report.counts[result.status] || 0) + 1;
      await updateReport(options.report);
    }
  }
  await Promise.all(Array.from({ length: Math.min(options.concurrency, images.length) }, worker));
}

async function acquireLock() {
  return fsp.open(LOCK_PATH, 'wx');
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const batchSize = numberArgument('--batch-size', DEFAULT_BATCH_SIZE, 1000);
  const concurrency = numberArgument('--concurrency', DEFAULT_CONCURRENCY, 10);
  const retries = numberArgument('--retries', DEFAULT_RETRIES, 5);
  const spreadsheet = path.resolve(__dirname, argumentValue('--spreadsheet', '../../Dados para serem migrados.xlsx'));
  let lock;
  try {
    lock = await acquireLock();
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('Já existe outra instância do migrador em execução');
    throw error;
  }

  const report = { startedAt: new Date().toISOString(), dryRun, counts: {}, results: [] };
  try {
    await updateReport(report);
    const images = await prisma.imagem.findMany({ include: { edificacao: { select: { id: true, familyId: true } } } });
    report.total = images.length;
    report.spreadsheet = await auditSpreadsheet(spreadsheet, images);
    await updateReport(report);
    const source = new AppSheetImageSource();
    const storage = new MinioStorageService();
    for (let offset = 0; offset < images.length; offset += batchSize) {
      await runWorkers(images.slice(offset, offset + batchSize), { dryRun, source, storage, retries, concurrency, report });
      console.log(JSON.stringify({ processed: Math.min(offset + batchSize, images.length), total: images.length }));
    }
    report.finishedAt = new Date().toISOString();
    await updateReport(report);
    console.log(JSON.stringify({ total: report.total, counts: report.counts, spreadsheet: report.spreadsheet }, null, 2));
  } finally {
    await lock.close();
    await fsp.unlink(LOCK_PATH).catch(() => {});
  }
}

main()
  .catch(error => {
    console.error(`Image migration failed: ${redact(error.message)}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });