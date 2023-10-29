import { EncryptableLocalFile } from "../localfile.js";
import { DriveRemote } from "../remote/base.js";

export interface DriveFileMeta {
  getName(): string;
  getId(): string;
  setName(name: string): void;
  getSize(): number;
  getMimeType(): string;
  getCreatedTime(): Date;
  isFolder(): boolean;
};

export interface DriveOperations {
  list(remote: DriveRemote, pwd: DriveFileMeta[]): Promise<DriveFileMeta[]>;
  upload(remote: DriveRemote, file: EncryptableLocalFile): Promise<DriveFileMeta>;
  download(remote: DriveRemote, file: DriveFileMeta): Promise<EncryptableLocalFile>;
  remove(remote: DriveRemote, file: DriveFileMeta): Promise<any>;
};

/** singleton object, used for accessing API */
export interface DriveAPI extends DriveOperations {
  isLoaded(): boolean;
  load(): Promise<void>;
  access(remote: DriveRemote, callback: Function): Promise<void>;
  revoke(remote: DriveRemote): Promise<void>;
};
