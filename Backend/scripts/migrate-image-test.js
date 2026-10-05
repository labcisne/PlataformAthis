#!/usr/bin/env node

const path = require('node:path');
const crypto = require('node:crypto');
const dotenv = require('dotenv');
const prisma = require('../Utils/prisma');
const AppSheetImageSource = require('../Services/appsheet/AppSheetImageSource');
const MinioStorageService = require('../Services/storage/MinioStorageService');

dotenv.config({ path: path.resolve(__dirname, '../config.env') });

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
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

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function verifyObject(storage, storageKey, expected) {
  const url = await storage.getPresignedUrl(storageKey, 300);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Presigned URL returned HTTP ${response.status}`);
  const downloaded = Buffer.from(await response.arrayBuffer());
  const downloadedHash = hash(downloaded);
  if (downloaded.length !== expected.size || downloadedHash !== expected.hash) {
    throw new Error('Presigned download failed size or SHA-256 validation');
  }
  return { url, size: downloaded.length, hash: downloadedHash };
}

async function main() {
  const imageId = argumentValue('--image-id');
  const imageIdArguments = process.argv.filter(argument => argument === '--image-id');
  if (!imageId || imageIdArguments.length !== 1 || process.argv.includes('--all')) {
    throw new Error('This controlled test requires exactly one --image-id and does not support bulk execution');
  }

  const image = await prisma.imagem.findUnique({
    where: { id: imageId },
    include: { edificacao: { select: { id: true, familyId: true } } }
  });
  if (!image || !image.edificacao || !image.foto) {
    throw new Error(`Image ${imageId} was not found, has no Edificação, or has no foto`);
  }

  const source = new AppSheetImageSource();
  const storage = new MinioStorageService();
  let original;
  try {
    original = await source.resolve(image.foto, image.appsheetSourceId);
  } catch (error) {
    console.error(JSON.stringify({ imageId, sourcePath: image.foto, error: error.message }));
    throw error;
  }

  const originalHash = hash(original.content);
  const extension = extensionFor(original);
  const storageKey = image.storageKey || `families/${image.edificacao.familyId}/edificacoes/${image.edificacao.id}/images/${image.id}${extension}`;

  if (!image.storageKey) {
    try {
      await storage.uploadFile({
        content: original.content,
        storageKey,
        contentType: original.mimeType,
        size: original.size
      });
    } catch (error) {
      console.error(JSON.stringify({ imageId, storageKey, error: error.message }));
      throw error;
    }
  } else {
    console.log(`Existing storage_key detected; upload skipped for image ${imageId}`);
  }

  const verification = await verifyObject(storage, storageKey, {
    size: original.size,
    hash: originalHash
  });

  let updated;
  try {
    updated = await prisma.imagem.update({
      where: { id: image.id },
      data: {
        storageKey,
        nomeOriginal: original.originalName,
        mimeType: original.mimeType,
        tamanho: original.size,
        hash: originalHash
      }
    });
  } catch (error) {
    console.error(JSON.stringify({ imageId, storageKey, error: error.message, uploadedObjectRequiresManualReview: true }));
    throw error;
  }

  console.log(JSON.stringify({
    imageId: updated.id,
    sourcePath: original.sourcePath,
    sourceMethod: 'AppSheet gettablefileurl with ApplicationAccessKey header',
    downloaded: { size: original.size, mimeType: original.mimeType },
    uploaded: !image.storageKey,
    storageKey: updated.storageKey,
    presignedUrlValidated: true,
    retrievedSize: verification.size,
    hashMatches: verification.hash === originalHash,
    historicalRecordsChanged: 1
  }, null, 2));
}

main()
  .catch(error => {
    console.error(`Controlled image migration failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
