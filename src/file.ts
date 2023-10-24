export class LocalFile {
  name: string;
  mimeType: string;
  size: number;
  createdTime: Date;
  content: string;

  constructor(name: string, size: number, mimeType: string, createdTime: Date, content: string) {
    this.name = name;
    this.size = size;
    this.mimeType = mimeType;
    this.createdTime = createdTime;
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
    return this.createdTime;
  }
};

