import { EncryptableLocalFile } from "../localfile.js";
import { DriveRemote } from "../remote/base.js";

export interface DriveFileMeta {
  getName(): string;
  getSize(): number;
  getMimeType(): string;
  getCreatedTime(): Date;
};

export interface DriveOperations {
  ls(remote: DriveRemote, pageSize: number, query: string): Promise<DriveFileMeta[]>;
  upload(remote: DriveRemote, file: EncryptableLocalFile): Promise<DriveFileMeta>;
  // get(remote: DriveRemote, file: DriveFileMeta): Promise<EncryptableLocalFile>;
};

/** singleton object, used for accessing API */
export interface DriveAPI extends DriveOperations {
  isLoaded(): boolean;
  load(): Promise<void>;
  access(remote: DriveRemote): Promise<void>;
  revoke(remote: DriveRemote): Promise<void>;
};
