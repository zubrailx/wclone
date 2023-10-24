export interface DriveFileInfo {
  getName(): string;
  getSize(): number;
  getMimeType(): string;
  getCreatedTime(): Date;
};

export interface DriveCtx {
  isLogged(): boolean;

  load(): void;
  init(client_id: String, api_key: String): Promise<void>;
  revoke(): Promise<void>;

  ls(pageSize: number, query: string): Promise<DriveFileInfo[]>;
};
