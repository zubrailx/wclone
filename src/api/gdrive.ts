import { EncryptableLocalFile } from "../localfile.js";
import { GDriveRemote } from "../remote/gdrive.js";
import { bytesArrToBase64, loadScript, until } from "../utils.js";
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
  gapiLoaded = false;
  gisLoaded = false;

  public async load(): Promise<void> {
    loadScript("https://apis.google.com/js/api.js", () => {
      gapi.load('client', {
        callback: () => {
          this.gapiLoaded = true;
        }
      })
    });
    loadScript("https://accounts.google.com/gsi/client", () => {
      this.gisLoaded = true;
    });

    await until(() => this.isLoaded());
  }

  public isLoaded(): boolean {
    return this.gapiLoaded && this.gisLoaded;
  }

  public async access(remote: GDriveRemote, callback: Function) {
    if (this.gapiLoaded && this.gisLoaded) {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: remote.getClientId(),
        scope: SCOPES,
        callback: (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            remote.setAccessToken(tokenResponse.access_token);
          }
          callback();
        }
      })
      this.requestAPIAccessToken(remote, tokenClient);
    } else {
      throw 'gapi or gis is not loaded';
    }
  }

  private async requestAPIAccessToken(remote: GDriveRemote, tokenClient: any) {
    if (remote.getAccessToken() == null) {
      return await tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      return await tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  public async revoke(remote: GDriveRemote) {
    const accessToken = remote.getAccessToken();
    if (accessToken !== null) {
      await google.accounts.oauth2.revoke(accessToken);
      remote.setAccessToken(null);
    }
  }

  private async initClient(remote: GDriveRemote) {
    return gapi.client.init({
      apiKey: remote.getAccessToken(),
      discoveryDocs: [DISCOVERY_DOC],
    });
  }

  public async ls(remote: GDriveRemote, pageSize: number, query: string): Promise<GDriveFileMeta[]> {
    return this.initClient(remote)
      .then((_) => {
        return gapi.client.drive.files.list({
          pageSize: pageSize,
          q: query,
          fields: 'files(id, name, size, mimeType, createdTime)',
        });
      })
      .then((r) => {
        return r.result.files.map(
          (file: any) => new GDriveFileMeta(
            file.id, file.name, file.size, file.mimeType, new Date(file.createdTime))
        );
      })
  };

  public async upload(remote: GDriveRemote, file: EncryptableLocalFile) {
    type Meta = {
      id?: string,
      name?: string,
      size?: number,
      mimeType?: string,
      createdTime?: Date
    };

    return this.initClient(remote)
      .then((_) => {
        return gapi.client.drive.files.create({
          uploadType: "media",
          resource: {
            mimeType: file.getMimeType(),
            name: file.getName(),
            createdTime: file.getModifiedTime().toISOString(),
            fields: 'id,name,size,mimeType,createdTime',
          }
        })
      })
      .then(async (res: any) => {
        const data = new Blob(file.getContent(), { type: file.getMimeType() });
        const meta: Meta = {};
        meta.id = res.result.id;
        meta.name = res.result.name;
        meta.size = Number(res.result.size);
        meta.mimeType = res.result.mimeType;
        await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${res.result.id}`, {
          method: 'PATCH',
          headers: new Headers({
            'Authorization': `Bearer ${gapi.client.getToken().access_token}`,
            'Content-Type': file.getMimeType()
          }),
          body: data
        });
        return meta;
      })
      .then((meta: Meta) => {
        meta.size = file.getSize();
        meta.createdTime = file.getModifiedTime();
        return meta;
      })
      .then((meta: Meta) => {
        return new GDriveFileMeta(
          meta.id, meta.name, meta.size, meta.mimeType, meta.createdTime);
      });
  }
}
