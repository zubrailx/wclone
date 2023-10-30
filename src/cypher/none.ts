import { Algorithm, LocalFileEncryptor } from "./base.js";

export class NoneFileEncryptor extends LocalFileEncryptor {
  constructor() {
    super(Algorithm.NONE);
  }

  async encrypt(dataArr: Uint8Array[]) {
    return dataArr;
  }

  async decrypt(dataArr: Uint8Array[]) {
    return dataArr;
  }
}
