import { EncryptableLocalFile, LocalFile } from "../file.js";

export enum Algorithm {
  NONE = 0,
  AES = 1
}

export abstract class Encryptor {
  algorithm: Algorithm

  constructor(algorithm: Algorithm) {
    this.algorithm = algorithm;
  }

  getAlgorithm() {
    return this.algorithm;
  }

  abstract encrypt(data: Uint8Array[]): Uint8Array[]
  abstract decrypt(data: Uint8Array[]): Uint8Array[]
};

export abstract class LocalFileEncryptor extends Encryptor {
  constructor(algorithm: Algorithm) {
    super(algorithm);
  }

  encryptFile(file: EncryptableLocalFile): EncryptableLocalFile {
    const encryptedContent = this.encrypt(file.getContent());
    const localfile = new LocalFile(file.getName(), file.getSize(), file.getMimeType(),
      file.getModifiedTime(), encryptedContent);
    return new EncryptableLocalFile(localfile, this.getAlgorithm());
  }

  decryptFile(file: EncryptableLocalFile): EncryptableLocalFile {
    const decryptedContent = this.decrypt(file.getContent());
    const localfile = new LocalFile(file.getName(), file.getSize(), file.getMimeType(),
      file.getModifiedTime(), decryptedContent);
    return new EncryptableLocalFile(localfile, Algorithm.NONE);
  }

}
