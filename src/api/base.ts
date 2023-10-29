import { EncryptableLocalFile } from "../localfile.js";
import { DriveRemote } from "../remote/base.js";

export interface DriveFileMeta {
  getName(): string;
  getSize(): number;
  getMimeType(): string;
  getCreatedTime(): Date;
};

export interface DriveOperations {
  list(remote: DriveRemote, pageSize: number, query: string): Promise<DriveFileMeta[]>;
  upload(remote: DriveRemote, file: EncryptableLocalFile): Promise<DriveFileMeta>;
  download(remote: DriveRemote, file: DriveFileMeta): Promise<EncryptableLocalFile>;
  cd(remote: DriveRemote, file: DriveFileMeta): Promise<DriveFileMeta[]>;
  remove(remote: DriveRemote, file: DriveFileMeta): Promise<DriveFileMeta[]>;
  pwd(remote: DriveRemote, file: DriveFileMeta): Promise<DriveFileMeta[]>;
};

/** singleton object, used for accessing API */
export interface DriveAPI extends DriveOperations {
  isLoaded(): boolean;
  load(): Promise<void>;
  access(remote: DriveRemote, callback: Function): Promise<void>;
  revoke(remote: DriveRemote): Promise<void>;
};
