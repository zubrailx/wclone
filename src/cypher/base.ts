export enum Algorithm {
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
