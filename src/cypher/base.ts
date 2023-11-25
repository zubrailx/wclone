import { mergeUint8Array } from "../utils.js";

export enum Algorithm {
  AES = 1,
  NONE = 2,
  XOR = 3
}

export abstract class Encryptor {
  algorithm: Algorithm

  constructor(algorithm: Algorithm) {
    this.algorithm = algorithm;
  }

  getAlgorithm() {
    return this.algorithm;
  }

  abstract encrypt(data: Uint8Array): Promise<Uint8Array>
  abstract decrypt(data: Uint8Array): Promise<Uint8Array>

  // default implementation
  async encryptList(dataArr: Uint8Array[]): Promise<Uint8Array[]> {
    return new Promise(resolve => {
      setTimeout(resolve, 0, null)
    }).then(async (_) => {
      const data: Uint8Array = mergeUint8Array(dataArr);
      return [await this.encrypt(data)]
    })
  }

  // default implementation
  async decryptList(dataArr: Uint8Array[]): Promise<Uint8Array[]> {
    return new Promise(resolve => {
      setTimeout(resolve, 0, null)
    }).then(async (_) => {
      const data = mergeUint8Array(dataArr);
      return [await this.decrypt(data)];
    })
  }
};
