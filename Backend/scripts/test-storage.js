const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const MinioStorageService = require('../Services/storage/MinioStorageService');

async function main() {
  const tempFile = path.join(os.tmpdir(), `athis-storage-test-${crypto.randomUUID()}.txt`);
  const storageKey = `tests/${crypto.randomUUID()}.txt`;
  const content = 'Athis MinIO storage integration test';
  const storage = new MinioStorageService();

  await fs.writeFile(tempFile, content, 'utf8');
  try {
    const file = await fs.readFile(tempFile);
    const uploaded = await storage.uploadFile({
      content: file,
      storageKey,
      contentType: 'text/plain',
      size: file.length
    });
    const url = await storage.getPresignedUrl(uploaded.storageKey, 300);
    const response = await fetch(url);
    const downloadedContent = await response.text();

    if (!response.ok || downloadedContent !== content) {
      throw new Error('Uploaded content could not be read from the presigned URL');
    }

    await storage.deleteFile(storageKey);
    const deletedResponse = await fetch(url);
    if (deletedResponse.ok) {
      throw new Error('Temporary object still exists after deletion');
    }

    console.log('Storage integration test passed: upload, presigned URL and delete.');
  } finally {
    await fs.rm(tempFile, { force: true });
  }
}

main().catch(error => {
  console.error(`Storage integration test failed: ${error.message}`);
  process.exitCode = 1;
});
