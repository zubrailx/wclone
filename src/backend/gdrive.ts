import { loadScript } from "../utils.js";
import { DriveFile, DriveCtx } from "./base.js";

declare var gapi: any;
declare var google: any;

class GDriveFile implements DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime: Date;

  constructor(id: string, name: string, mimeType: string, createdTime: Date) {
    this.id = id;
    this.name = name;
    this.mimeType = mimeType;
    this.createdTime = createdTime;
  }

  getName(): string {
    return this.name;
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

export class GDriveCtx implements DriveCtx {
  CLIENT_ID: String;
  API_KEY: String;
  tokenClient: any;

  gapiLoaded = false;
  gisLoaded = false;

  gapiInited = false;
  gisInited = false;

  load(): void {
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
            self.tokenClient.requestAccessToken({ prompt: 'consent' });
          } else {
            self.tokenClient.requestAccessToken({ prompt: '' });
          }
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
  }

  public async ls(pageSize: number, query: string): Promise<GDriveFile[]> {
    let response;
    response = await gapi.client.drive.files.list({
      'pageSize': pageSize,
      'q': query,
      'fields': 'files(id, name, mimeType, createdTime)',
    });
    return response.result.files.map(
      (file: any) => new GDriveFile(file.id, file.name, file.mimeType, new Date(file.createdTime))
    );
  }
}
