const path = require('node:path');
const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config({ path: path.resolve(__dirname, '../../config.env') });

function requiredConfig(config, name) {
  const value = config[name];
  if (!value) throw new Error(`Missing AppSheet configuration: ${name}`);
  return value;
}

function escapeDriveQuery(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function apiHost(config) {
  const region = config.APPSHEET_REGION || 'www';
  return region.includes('.') ? region : `${region}.appsheet.com`;
}

class AppSheetImageSource {
  constructor(config = process.env) {
    this.appId = requiredConfig(config, 'APPSHEET_APP_ID');
    this.applicationAccessKey = requiredConfig(config, 'APPSHEET_APPLICATION_ACCESS_KEY');
    this.imageColumn = config.APPSHEET_IMAGE_COLUMN || 'Foto:';
    this.typeColumn = config.APPSHEET_TYPE_COLUMN || 'Tipo';
    this.apiHost = apiHost(config);
    this.driveAuth = new google.auth.GoogleAuth({
      keyFile: requiredConfig(config, 'GOOGLE_SERVICE_ACCOUNT_FILE'),
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });
    this.drive = google.drive({ version: 'v3', auth: this.driveAuth });
    this.fileCache = new Map();
  }

  async resolve(sourcePath, appsheetSourceId, sourceTableOverride = null) {
    const pathValue = String(sourcePath || '').trim();
    if (!pathValue) throw new Error('AppSheet image path is empty');
    if (!appsheetSourceId) throw new Error('AppSheet source id is empty');
    const sourceTable = sourceTableOverride || pathValue.match(/^(.+)_Images\//)?.[1];
    if (!sourceTable) throw new Error('AppSheet image path does not identify a photo table');

    const apiUrl = `https://${this.apiHost}/api/v2/apps/${encodeURIComponent(this.appId)}/tables/${encodeURIComponent(sourceTable)}/Action`;
    const findResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApplicationAccessKey: this.applicationAccessKey
      },
      body: JSON.stringify({
        Action: 'Find',
        Properties: { Locale: 'pt-BR' },
        Rows: [{ 'ID:': appsheetSourceId }]
      })
    });
    if (!findResponse.ok) {
      const details = (await findResponse.text()).trim();
      throw new Error(`AppSheet Find request failed with HTTP ${findResponse.status}${details ? `: ${details}` : ''}`);
    }
    const result = await findResponse.json();
    const row = result.Rows?.[0];
    const fileReference = row?.[this.imageColumn] || row?.Foto || pathValue;
    const [folderPath, originalName] = String(fileReference).split(/\\|\//).reduce((parts, segment, index, all) => {
      if (index === all.length - 1) return [parts[0], segment];
      parts[0].push(segment);
      return parts;
    }, [[], '']);
    if (!folderPath.length || !originalName) throw new Error('AppSheet image reference is not a relative file path');
    if (this.fileCache.has(originalName)) {
      return this.downloadDriveFile(this.fileCache.get(originalName), originalName, pathValue);
    }

    const fileResponse = await this.drive.files.list({
      q: `name = '${escapeDriveQuery(originalName)}' and trashed = false`,
      fields: 'files(id,name,mimeType,size)',
      pageSize: 100,
      spaces: 'drive',
      corpora: 'allDrives',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true
    });
    const files = fileResponse.data.files || [];
    if (!files.length) throw new Error(`Arquivo não encontrado no Google Drive: ${originalName}`);
    if (files.length > 1) throw new Error(`Múltiplos arquivos encontrados no Google Drive: ${originalName}`);
    this.fileCache.set(originalName, files[0]);
    return this.downloadDriveFile(files[0], originalName, pathValue);
  }

  async downloadDriveFile(file, originalName, sourcePath) {
    const response = await this.drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'arraybuffer' });
    const content = Buffer.from(response.data);
    if (!content.length) throw new Error(`Download vazio no Google Drive: ${originalName}`);
    const mimeType = file.mimeType || 'application/octet-stream';
    if (mimeType === 'text/html' || mimeType === 'application/json' || !this.isImage(content)) {
      throw new Error(`Tipo de arquivo inesperado no Google Drive: ${originalName}`);
    }

    return {
      content,
      mimeType,
      originalName: file.name || originalName,
      size: content.length,
      sourcePath
    };
  }

  isImage(content) {
    return (content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff)
      || content.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
      || content.subarray(0, 6).toString('ascii').match(/^GIF8[79]a$/)
      || (content.subarray(0, 4).toString('ascii') === 'RIFF' && content.subarray(8, 12).toString('ascii') === 'WEBP');
  }

  originalName(sourcePath, contentDisposition) {
    const dispositionName = contentDisposition?.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i)?.[1];
    const name = dispositionName || path.basename(sourcePath.replace(/\\/g, '/'));
    return decodeURIComponent(name).trim() || null;
  }
}

module.exports = AppSheetImageSource;
