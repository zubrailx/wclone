import { Algorithm, Encryptor } from "./base.js";

export class NoneFileEncryptor extends Encryptor {
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
