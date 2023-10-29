import { Algorithm, LocalFileEncryptor } from "./base.js";

export class NoneFileEncryptor extends LocalFileEncryptor {
  constructor() {
    super(Algorithm.NONE);
  }

  encrypt(dataArr: Uint8Array[]): Uint8Array[] {
    return dataArr;
  }

  decrypt(dataArr: Uint8Array[]): Uint8Array[] {
    return dataArr;
  }
}
