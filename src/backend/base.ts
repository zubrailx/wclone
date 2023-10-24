export interface DriveFile {
  getName(): string;
  getSize(): number;
  getMimeType(): string;
  getCreatedTime(): Date;
};

export interface DriveCtx {
  load(): void;
  init(client_id: String, api_key: String): Promise<void>;
  revoke(): Promise<void>;

  ls(pageSize: number, query: string): Promise<DriveFile[]>;
};
