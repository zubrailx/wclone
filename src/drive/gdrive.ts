import { EncryptableLocalFile } from "../localfile.js";
import { bytesArrToBase64, loadScript } from "../utils.js";
import { DriveFileMeta as DriveFileMeta, DriveAPI } from "./base.js";

declare var gapi: any;
declare var google: any;

class GDriveFileMeta implements DriveFileMeta {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdTime: Date;

  constructor(id?: string, name?: string, size?: number, mimeType?: string, createdTime?: Date) {
    this.id = id!;
    this.name = name!;
    this.size = size!;
    this.mimeType = mimeType!;
    this.createdTime = createdTime!;
  }

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.size;
  }

  getMimeType(): string {
    return this.mimeType;
  }

  getCreatedTime(): Date {
    return this.createdTime;
  }
};

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive';

export class GDriveAPI implements DriveAPI {
  CLIENT_ID: String;
  API_KEY: String;
  tokenClient: any;

  gapiLoaded = false;
  gisLoaded = false;

  gapiInited = false;
  gisInited = false;

  logged = false;

  public isLogged(): boolean {
    return this.logged;
  }

  public load(): void {
    loadScript("https://apis.google.com/js/api.js", () => {
      this.gapiLoaded = true;
    });
    loadScript("https://accounts.google.com/gsi/client", () => {
      this.gisLoaded = true;
    });
  }

  public async init(client_id: String, api_key: String): Promise<void> {
    this.CLIENT_ID = client_id
    this.API_KEY = api_key

    if (this.gapiLoaded && this.gisLoaded) {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.CLIENT_ID,
        scope: SCOPES,
      });
      this.gisInited = true;

      const self = this;

      gapi.load('client', {
        callback: async function() {
          await gapi.client.init({
            apiKey: self.API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
          self.gapiInited = true;

          if (gapi.client.getToken() === null) {
            await self.tokenClient.requestAccessToken({ prompt: 'consent' });
          } else {
            await self.tokenClient.requestAccessToken({ prompt: '' });
          }
          self.logged = true;
        }
      });
    } else {
      throw 'gapi or gis is not inited';
    }
  }

  public async revoke() {
    const token = gapi.client.getToken();
    if (token !== null) {
      await google.accounts.oauth2.revoke(token.access_token);
      await gapi.client.setToken('');
    }
    this.logged = false;
  }

  public async ls(pageSize: number, query: string): Promise<GDriveFileMeta[]> {
    let response;
    response = await gapi.client.drive.files.list({
      pageSize: pageSize,
      q: query,
      fields: 'files(id, name, size, mimeType, createdTime)',
    });
    return response.result.files.map(
      (file: any) => new GDriveFileMeta(file.id, file.name, file.size, file.mimeType, new Date(file.createdTime))
    );
  }

  public async upload(file: EncryptableLocalFile) {
    const meta: {
      id?: string,
      name?: string,
      size?: number,
      mimeType?: string,
      createdTime?: Date
    } = {};
    await gapi.client.drive.files.create({
      uploadType: "media",
      resource: {
        mimeType: file.getMimeType(),
        name: file.getName(),
        createdTime: file.getModifiedTime().toISOString(),
        fields: 'id,name,size,mimeType,createdTime',
      }
    }).then(async (res: any) => {
      const data = new Blob(file.getContent(), { type: file.getMimeType() });
      meta.id = res.result.id;
      meta.name = res.result.name;
      meta.size = Number(res.result.size);
      meta.mimeType = res.result.mimeType;
      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${res.result.id}`, {
        method: 'PATCH',
        headers: new Headers({
          'Authorization': `Bearer ${gapi.client.getToken().access_token}`,
          'Content-Type': file.getMimeType()
        }),
        body: data
      }).then((_: any) => {
        meta.size = file.getSize();
        meta.createdTime = file.getModifiedTime();
      });
    })
    return new GDriveFileMeta(meta.id, meta.name, meta.size, meta.mimeType, meta.createdTime);
  }

  public async get(file: DriveFileMeta): Promise<EncryptableLocalFile> {

  }
}
