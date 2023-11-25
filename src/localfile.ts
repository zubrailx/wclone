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
