import { readStreamChunks } from "./utils.js";

export class LocalFile {
  name: string;
  mimeType: string;
  size: number;
  lastModified: Date;
  content: Uint8Array[];

  constructor(name: string, size: number, mimeType: string, lastModified: Date, content: Uint8Array[]) {
    this.name = name;
    this.size = size;
    this.mimeType = mimeType;
    this.lastModified = lastModified;
    this.content = content;
  }

  getName() {
    return this.name;
  }

  getSize() {
    return this.size;
  }

  getMimeType() {
    return this.mimeType;
  }

  getCreatedTime() {
    return this.lastModified;
  }

  toFile(): File {
    return new File(this.content, this.getName(), { type: this.mimeType, lastModified: this.lastModified.getTime() });
  }
};

export async function fromFile(file: File): Promise<LocalFile> {
  const content = await readStreamChunks(file.stream());
  return new LocalFile(file.name, file.size, file.type, new Date(file.lastModified), content);
}
