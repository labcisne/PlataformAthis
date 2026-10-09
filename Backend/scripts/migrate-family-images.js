#!/usr/bin/env node

const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const crypto = require('node:crypto');
const dotenv = require('dotenv');
const prisma = require('../Utils/prisma');
const AppSheetImageSource = require('../Services/appsheet/AppSheetImageSource');
const MinioStorageService = require('../Services/storage/MinioStorageService');

dotenv.config({ path: path.resolve(__dirname, '../config.env') });

const REPORT_PATH = path.resolve(__dirname, '../migration-family-images-report.json');
const LOCK_PATH = path.resolve(__dirname, '../migration-family-images.lock');

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function isImage(content) {
  return (content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff)
    || content.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
    || /^GIF8[79]a$/.test(content.subarray(0, 6).toString('ascii'))
    || (content.subarray(0, 4).toString('ascii') === 'RIFF' && content.subarray(8, 12).toString('ascii') === 'WEBP');
}

function extensionFor(name) {
  const extension = path.extname(name || '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  return extension || '.bin';
}

function photoIdFromPath(sourcePath) {
  const match = String(sourcePath || '').match(/(?:^|[\\/])([^\\/]+)\.Foto-[^\\/]*\.[^.]+$/i);
  return match?.[1] || null;
}

function isMigratedPath(value) {
  return /^\/?imagens\/[^/\\]+$/i.test(String(value || '').trim());
}

function redact(message) {
  return ['APPSHEET_APPLICATION_ACCESS_KEY', 'MINIO_SECRET_KEY', 'MINIO_ACCESS_KEY', 'DATABASE_URL', 'SECRET_STR']
    .reduce((result, name) => process.env[name] ? result.replaceAll(process.env[name], `[redacted:${name}]`) : result, String(message));
}

async function verifyObject(storage, storageKey) {
  const url = await storage.getPresignedUrl(storageKey, 300);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Objeto retornou HTTP ${response.status}`);
  const content = Buffer.from(await response.arrayBuffer());
  if (!content.length || !isImage(content)) throw new Error('Objeto vazio ou conteúdo não é imagem');
  return { size: content.length, hash: hash(content) };
}

let reportWrite = Promise.resolve();
function saveReport(report) {
  const write = async () => {
    const temporaryPath = `${REPORT_PATH}.${process.pid}.tmp`;
    await fsp.writeFile(temporaryPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    try {
      await fsp.rename(temporaryPath, REPORT_PATH);
    } catch (error) {
      await fsp.unlink(temporaryPath).catch(() => {});
      throw error;
    }
  };
  reportWrite = reportWrite.catch(() => {}).then(write);
  return reportWrite;
}

async function processImage(image, { dryRun, source, storage, report }) {
  const result = { familyImageId: image.id, familyId: image.familyId, originalPath: image.caminho };
  if (!image.family || !image.familyId) {
    return { ...result, status: 'pending', reason: 'Família associada não existe' };
  }
  if (isMigratedPath(image.caminho)) {
    const storageKey = String(image.caminho).replace(/^\/+/, '');
    try {
      const verified = await verifyObject(storage, storageKey);
      return { ...result, status: 'already_migrated_valid', storageKey, ...verified };
    } catch (error) {
      return { ...result, status: 'validation_error', storageKey, reason: redact(error.message) };
    }
  }

  const photoId = photoIdFromPath(image.caminho);
  if (!photoId) return { ...result, status: 'pending', reason: 'ID da foto não identificado com segurança' };
  if (dryRun) return { ...result, status: 'pending_migration', photoId };

  try {
    const original = await source.resolve(image.caminho, photoId, 'Fotos');
    if (!original.content?.length || original.size !== original.content.length || !isImage(original.content)) {
      throw new Error('Download vazio, tamanho inconsistente ou conteúdo não é imagem');
    }
    const storageKey = `imagens/${image.id}${extensionFor(original.originalName)}`;
    await storage.uploadFile({ content: original.content, storageKey, contentType: original.mimeType, size: original.size });
    const verified = await verifyObject(storage, storageKey);
    if (verified.size !== original.size || verified.hash !== hash(original.content)) throw new Error('Validação pós-upload divergiu do download');
    await prisma.familyImage.update({ where: { id: image.id }, data: { caminho: `/${storageKey}` } });
    return { ...result, status: 'migrated', photoId, storageKey, ...verified };
  } catch (error) {
    return { ...result, status: 'migration_error', photoId, reason: redact(error.message) };
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  let lock;
  try {
    lock = await fsp.open(LOCK_PATH, 'wx');
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('Já existe outra instância da migração de fotos de famílias');
    throw error;
  }
  const report = { startedAt: new Date().toISOString(), dryRun, total: 0, counts: {}, results: [] };
  try {
    await saveReport(report);
    const images = await prisma.familyImage.findMany({
      include: { family: { select: { id: true } } },
      orderBy: { id: 'asc' }
    });
    report.total = images.length;
    report.elegible = images.filter(image => !isMigratedPath(image.caminho)).length;
    await saveReport(report);
    const source = new AppSheetImageSource();
    const storage = new MinioStorageService();
    for (const image of images) {
      const result = await processImage(image, { dryRun, source, storage, report });
      report.results.push(result);
      report.counts[result.status] = (report.counts[result.status] || 0) + 1;
      await saveReport(report);
    }
    report.finishedAt = new Date().toISOString();
    await saveReport(report);
    console.log(JSON.stringify({ total: report.total, elegible: report.elegible, counts: report.counts }, null, 2));
  } finally {
    await lock.close();
    await fsp.unlink(LOCK_PATH).catch(() => {});
  }
}

main()
  .catch(error => {
    console.error(`Family image migration failed: ${redact(error.message)}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });