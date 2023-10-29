import { Algorithm } from "../cypher/base.js";
import { EncryptableLocalFile, LocalFile } from "../localfile.js";
import { GDriveRemote } from "../remote/gdrive.js";
import { loadScript, readStreamChunks, until } from "../utils.js";
import { DriveFileMeta as DriveFileMeta, DriveAPI } from "./base.js";

declare var gapi: any;
declare var google: any;

type Meta = {
  id?: string,
  name?: string,
  size?: number,
  mimeType?: string,
  createdTime?: Date
};

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

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
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

  isFolder(): boolean {
    return this.mimeType === "application/vnd.google-apps.folder";
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
      apiKey: remote.getApiKey(),
      discoveryDocs: [DISCOVERY_DOC],
      encoding: null,
    }).then(() => {
      gapi.client.setToken({
        access_token: remote.getAccessToken()
      })
    });
  }

  public async list(remote: GDriveRemote, pwd: GDriveFileMeta[]): Promise<GDriveFileMeta[]> {
    let query = pwd.length == 0
      ? "(parents in 'root')"
      : `(parents in '${pwd[pwd.length - 1].id}')`;
    query += " and (trashed = false)";

    return this.initClient(remote)
      .then((_) => {
        return gapi.client.drive.files.list({
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

  public async upload(remote: GDriveRemote, pwd: DriveFileMeta[], file: EncryptableLocalFile) {
    const meta: Meta = {}
    const location = pwd.length == 0 ? 'root' : `${pwd[pwd.length - 1].getId()}`
    return this.initClient(remote)
      .then((_) => {
        return gapi.client.drive.files.create({
          uploadType: "media",
          resource: {
            mimeType: file.getMimeType(),
            name: file.getName(),
            createdTime: file.getModifiedTime().toISOString(),
            fields: 'id,name,size,mimeType,createdTime',
            parents: [location],
          }
        })
      })
      .then(async (res: any) => {
        const data = new Blob(file.getContent(), { type: file.getMimeType() });
        meta.id = res.result.id;
        meta.name = res.result.name;
        meta.size = Number(res.result.size);
        meta.mimeType = res.result.mimeType;
        return await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${res.result.id}`, {
          method: 'PATCH',
          headers: new Headers({
            'Authorization': `Bearer ${gapi.client.getToken().access_token}`,
            'Content-Type': file.getMimeType()
          }),
          body: data
        });
      })
      .then((_) => {
        meta.size = file.getSize();
        meta.createdTime = file.getModifiedTime();
        return new GDriveFileMeta(
          meta.id, meta.name, meta.size, meta.mimeType, meta.createdTime);
      })
  }

  public async download(remote: GDriveRemote, file: GDriveFileMeta): Promise<EncryptableLocalFile> {
    const meta: Meta = {};

    return this.initClient(remote)
      .then((_) => {
        return gapi.client.drive.files.get({
          fileId: file.id,
          fields: 'id,name,size,mimeType,createdTime',
        })
      })
      .then(async (r) => {
        meta.id = r.result.id;
        meta.name = r.result.name;
        meta.size = r.result.size;
        meta.mimeType = r.result.mimeType;
        meta.createdTime = new Date(r.result.createdTime);

        return await fetch(
          `https://www.googleapis.com/drive/v3/files/${meta.id}?alt=media`, {
          method: 'GET',
          headers: new Headers({
            'Authorization': `Bearer ${gapi.client.getToken().access_token}`,
            'Content-Type': meta.mimeType!,
          })
        });
      }).then((res) => {
        return res.blob();
      })
      .then(async (res) => {
        const chunks = await readStreamChunks(res.stream());
        return new EncryptableLocalFile(
          new LocalFile(meta.name!, meta.size!, meta.mimeType!, meta.createdTime!, chunks), Algorithm.NONE_OR_UNK);
      })
  }

  public async remove(remote: GDriveRemote, file: GDriveFileMeta): Promise<any> {
    return this.initClient(remote)
      .then((_) => {
        return gapi.client.drive.files.delete({
          fileId: file.id
        })
      }).then((res) => {
        return res;
      })
  }

}
