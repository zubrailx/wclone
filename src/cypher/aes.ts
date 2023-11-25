import { CryptJsWordArrayToUint8Array, Uint8ArrayToCryptJsWordArray, base64ToBytes, bytesToBase64 } from "../utils.js";
import { Algorithm, Encryptor } from "./base.js";

import CryptoJS from 'crypto-js';

class AESEncryptor extends Encryptor {
  secretKey: string

  constructor(secretKey: string) {
    super(Algorithm.AES);
    this.secretKey = secretKey;
  }


  async encrypt(data: Uint8Array): Promise<Uint8Array> {
    const dataWordArr = Uint8ArrayToCryptJsWordArray(data);
    const result = CryptoJS.AES.encrypt(dataWordArr, this.secretKey).toString();
    return base64ToBytes(result);
  }

  async decrypt(data: Uint8Array): Promise<Uint8Array> {
    const dataStr = bytesToBase64(data);
    const result = CryptoJS.AES.decrypt(dataStr, this.secretKey);
    return CryptJsWordArrayToUint8Array(result);
  }
}


export { AESEncryptor };
