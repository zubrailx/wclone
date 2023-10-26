export interface DriveFileMeta {
  getName(): string;
  getSize(): number;
  getMimeType(): string;
  getCreatedTime(): Date;
};

export interface DriveOperations {
  ls(pageSize: number, query: string): Promise<DriveFileMeta[]>;
};

export interface DriveAPI extends DriveOperations {
  isLogged(): boolean;

  load(): void;
  init(client_id: String, api_key: String): Promise<void>;
  revoke(): Promise<void>;
};
