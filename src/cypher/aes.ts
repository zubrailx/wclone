import { CryptJsWordArrayToUint8Array, Uint8ArrayToCryptJsWordArray, base64ToBytes, bytesToBase64 } from "../utils.js";
import { Algorithm, LocalFileEncryptor } from "./base.js";

import CryptoJS from 'crypto-js';

class AESFileEncryptor extends LocalFileEncryptor {
  secretKey: string
  options: any

  constructor(secretKey: string) {
    super(Algorithm.AES);
    this.secretKey = secretKey;
    this.options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Hex.parse("18191a1b1c1d1e1f"),
      salt: CryptoJS.enc.Hex.parse("1011121314151617"),
    };
  }

  encrypt(dataArr: Uint8Array[]): Uint8Array[] {
    const euDataArr = []
    for (const data of dataArr) {
      euDataArr.push(this.encryptOne(data));
    }
    return euDataArr;
  }

  decrypt(dataArr: Uint8Array[]): Uint8Array[] {
    const euDataArr = []
    for (const data of dataArr) {
      euDataArr.push(this.decryptOne(data));
    }
    return euDataArr;
  }

  private encryptOne(data: Uint8Array): Uint8Array {
    const dataWordArr = Uint8ArrayToCryptJsWordArray(data);
    const result = CryptoJS.AES.encrypt(dataWordArr, this.secretKey, this.options).toString();
    const u8Arr = base64ToBytes(result);
    return u8Arr;
  }

  private decryptOne(data: Uint8Array): Uint8Array {
    const dataStr = bytesToBase64(data);
    const result = CryptoJS.AES.decrypt(dataStr, this.secretKey, this.options);
    const u8Arr = CryptJsWordArrayToUint8Array(result);
    return u8Arr;
  }
}


export { AESFileEncryptor };
