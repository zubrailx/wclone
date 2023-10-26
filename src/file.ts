import { Algorithm } from "./cypher/base.js";
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

  getModifiedTime() {
    return this.lastModified;
  }

  getContent(): Uint8Array[] {
    return this.content;
  }

  toFile(): File {
    return new File(this.content, this.getName(), { type: this.mimeType, lastModified: this.lastModified.getTime() });
  }
};

export async function fromFile(file: File): Promise<LocalFile> {
  const content = await readStreamChunks(file.stream());
  return new LocalFile(file.name, file.size, file.type, new Date(file.lastModified), content);
}


export class EncryptableLocalFile extends LocalFile {
  algorithm: Algorithm

  constructor(localfile: LocalFile, algorithm: Algorithm) {
    super(localfile.getName(), localfile.getSize(), localfile.getMimeType(),
      localfile.getModifiedTime(), localfile.getContent());
    this.algorithm = algorithm;
  }

  getEncryptAlgorithm() {
    return this.algorithm;
  }
}
