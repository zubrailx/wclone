import { Algorithm } from "./cypher/base.js";

export class LocalFile {
  file: File

  constructor(file: File) {
    this.file = file
  }

  getName() {
    return this.file.name;
  }

  getSize() {
    return this.file.size;
  }

  getMimeType() {
    return this.file.type;
  }

  getModifiedTime() {
    return new Date(this.file.lastModified);
  }

  getFile() {
    return this.file;
  }

};

export class EncryptableLocalFile extends LocalFile {
  algorithm: Algorithm

  constructor(localfile: LocalFile, algorithm: Algorithm) {
    super(localfile.file);
    this.algorithm = algorithm;
  }

  getEncryptAlgorithm() {
    return this.algorithm;
  }
}
