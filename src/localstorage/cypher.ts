import { AESEncryptor } from "../cypher/aes.js";
import { Encryptor } from "../cypher/base.js";
import { clone } from "../utils.js";
import { STORAGE_AUTO_ENCRYPTION, STORAGE_CYPHER_KEY } from "./general.js";

export function storageGetCypherConfigured(_encr: Encryptor): Encryptor {
  const _item = window.localStorage.getItem(STORAGE_CYPHER_KEY)
  const encr = clone(_encr);
  if (_item == null) {
    return encr;
  }
  const item = JSON.parse(_item);

  if (_encr instanceof AESEncryptor) {
    const elem = item["aes"]
    if (elem != null) {
      const aes: AESEncryptor = encr as AESEncryptor;
      aes.secretKey = elem.secretKey;
    }
  }

  return encr;
}

export function storageGetCyphersConfigured(encrs: Encryptor[]): Encryptor[] {
  return encrs.map(encr => storageGetCypherConfigured(encr));
}

export function storageSetCypherConfigured(encr: Encryptor) {
  const _item = window.localStorage.getItem(STORAGE_CYPHER_KEY);
  let item;
  if (_item == null) {
    item = {} as any;
  } else {
    item = JSON.parse(_item);
  }

  if (encr instanceof AESEncryptor) {
    if (item["aes"] == null) {
      item["aes"] = {}
    }
    const elem = item["aes"] as any;
    elem.secretKey = encr.secretKey;
  }
  window.localStorage.setItem(STORAGE_CYPHER_KEY, JSON.stringify(item));
}

export function storageSetCyphersConfigured(encrs: Encryptor[]) {
  encrs.forEach(encr => {
    storageSetCypherConfigured(encr);
  });
}

export function storageGetAutoEncryption(): boolean {
  const elem = window.localStorage.getItem(STORAGE_AUTO_ENCRYPTION);
  return elem === 'true';
}

export function storageSetAutoEncryption(v: boolean) {
  window.localStorage.setItem(STORAGE_AUTO_ENCRYPTION, String(v));
}
