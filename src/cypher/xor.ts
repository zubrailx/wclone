import { CryptJsWordArrayToUint8Array, Uint8ArrayToCryptJsWordArray, base64ToBytes, bytesToBase64, mergeUint8Array } from "../utils.js";
import { Algorithm, LocalFileEncryptor } from "./base.js";

import CryptoJS from 'crypto-js';

class XorFileEncryptor extends LocalFileEncryptor {
  constructor() {
    super(Algorithm.AES);
  }

  // NOTE: need to merge arrays because salt would be added in the beginning
  // to execute really in background, need to use Workers
  async encrypt(dataArr: Uint8Array[]): Promise<Uint8Array[]> {
    const data: Uint8Array = mergeUint8Array(dataArr);
    const dataWordArr = Uint8ArrayToCryptJsWordArray(data);
    const result = CryptoJS.AES.encrypt(dataWordArr, this.secretKey).toString();
    const u8Arr = base64ToBytes(result);
    return [u8Arr]
  }

  async decrypt(dataArr: Uint8Array[]): Promise<Uint8Array[]> {
    return new Promise(resolve => {
      setTimeout(resolve, 0, null)
    }).then((_) => {
      const data = mergeUint8Array(dataArr);
      const dataStr = bytesToBase64(data);
      const result = CryptoJS.AES.decrypt(dataStr, this.secretKey);
      const u8Arr = CryptJsWordArrayToUint8Array(result);
      return [u8Arr];
    })
  }
}


export { AESFileEncryptor };
