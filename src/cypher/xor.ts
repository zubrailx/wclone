import { stringToUint8Array } from "../utils.js";
import { Algorithm, Encryptor } from "./base.js";

export class XOREncryptor extends Encryptor {
  secretKey: string

  constructor(secretKey: string) {
    super(Algorithm.XOR);
    this.secretKey = secretKey;
  }

  getUint8ArrayKey() {
    return stringToUint8Array(this.secretKey);
  }

  async encrypt(data: Uint8Array): Promise<Uint8Array> {
    const key = this.getUint8ArrayKey();
    const ks = key.length;
    for (let i = 0; i < data.length; ++i) {
      data[i] ^= key[i % ks];
    }
    return data;
  }

  async decrypt(data: Uint8Array): Promise<Uint8Array> {
    return this.encrypt(data);
  }

}
