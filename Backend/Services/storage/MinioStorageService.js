const path = require('node:path');
const dotenv = require('dotenv');
const Minio = require('minio');
const StorageService = require('./StorageService');
const StorageError = require('./StorageError');

dotenv.config({ path: path.resolve(__dirname, '../../config.env') });

function parseBoolean(value) {
  return String(value).toLowerCase() === 'true';
}

function requiredConfig(config, name) {
  const value = config[name];
  if (!value) throw new StorageError(`Missing storage configuration: ${name}`);
  return value;
}

class MinioStorageService extends StorageService {
  constructor(config = process.env) {
    super();
    this.bucket = requiredConfig(config, 'MINIO_BUCKET');
    this.client = new Minio.Client({
      endPoint: requiredConfig(config, 'MINIO_ENDPOINT').replace(/^https?:\/\//, '').replace(/\/$/, ''),
      port: Number(config.MINIO_PORT || 9000),
      useSSL: parseBoolean(config.MINIO_USE_SSL),
      accessKey: requiredConfig(config, 'MINIO_ACCESS_KEY'),
      secretKey: requiredConfig(config, 'MINIO_SECRET_KEY')
    });
    this.bucketReady = null;
  }

  async ensureBucket() {
    if (!this.bucketReady) {
      this.bucketReady = this.client.bucketExists(this.bucket)
        .then(async exists => {
          if (!exists) await this.client.makeBucket(this.bucket, 'us-east-1');
        })
        .catch(error => {
          this.bucketReady = null;
          throw error;
        });
    }
    await this.bucketReady;
  }

  async uploadFile({ content, storageKey, contentType, size }) {
    try {
      await this.ensureBucket();
      const metadata = contentType ? { 'Content-Type': contentType } : undefined;
      const knownSize = size ?? (Buffer.isBuffer(content) ? content.length : undefined);
      await this.client.putObject(this.bucket, storageKey, content, knownSize, metadata);
      return {
        storageKey,
        mimeType: contentType || null,
        tamanho: knownSize ?? null
      };
    } catch (error) {
      throw new StorageError('Unable to upload file to storage', error);
    }
  }

  async getPresignedUrl(storageKey, expiration = 3600) {
    try {
      await this.ensureBucket();
      return await this.client.presignedGetObject(this.bucket, storageKey, expiration);
    } catch (error) {
      throw new StorageError('Unable to create storage URL', error);
    }
  }

  async getFile(storageKey) {
    try {
      await this.ensureBucket();
      return await this.client.getObject(this.bucket, storageKey);
    } catch (error) {
      throw new StorageError('Unable to read file from storage', error);
    }
  }

  async deleteFile(storageKey) {
    try {
      await this.client.removeObject(this.bucket, storageKey);
    } catch (error) {
      throw new StorageError('Unable to delete file from storage', error);
    }
  }
}

module.exports = MinioStorageService;
