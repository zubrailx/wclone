import { EncryptableLocalFile, LocalFile } from "../localfile.js";

export enum Algorithm {
  NONE_OR_UNK = 0,
  AES = 1,
  NONE = 2,
}

export abstract class Encryptor {
  algorithm: Algorithm

  constructor(algorithm: Algorithm) {
    this.algorithm = algorithm;
  }

  getAlgorithm() {
    return this.algorithm;
  }

  abstract encrypt(data: Uint8Array[]): Promise<Uint8Array[]>
  abstract decrypt(data: Uint8Array[]): Promise<Uint8Array[]>
};

export abstract class LocalFileEncryptor extends Encryptor {
  constructor(algorithm: Algorithm) {
    super(algorithm);
  }

  async encryptFile(file: EncryptableLocalFile): Promise<EncryptableLocalFile> {
    const encryptedContent = await this.encrypt(file.getContent());
    const localfile = new LocalFile(file.getName(), encryptedContent.reduce((a, b) => a + b.length, 0), file.getMimeType(),
      file.getModifiedTime(), encryptedContent);
    return new EncryptableLocalFile(localfile, this.getAlgorithm());
  }

  async decryptFile(file: EncryptableLocalFile): Promise<EncryptableLocalFile> {
    const decryptedContent = await this.decrypt(file.getContent());
    const localfile = new LocalFile(file.getName(), decryptedContent.reduce((a, b) => a + b.length, 0), file.getMimeType(),
      file.getModifiedTime(), decryptedContent);
    return new EncryptableLocalFile(localfile, Algorithm.NONE_OR_UNK);
  }

}
