class StorageService {
  async uploadFile() {
    throw new Error('StorageService.uploadFile must be implemented');
  }

  async getPresignedUrl() {
    throw new Error('StorageService.getPresignedUrl must be implemented');
  }

  async getFile() {
    throw new Error('StorageService.getFile must be implemented');
  }

  async deleteFile() {
    throw new Error('StorageService.deleteFile must be implemented');
  }
}

module.exports = StorageService;
