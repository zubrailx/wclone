import { AESFileEncryptor } from "../cypher/aes.js";
import { LocalFileEncryptor } from "../cypher/base.js";
import { clone } from "../utils.js";
import { STORAGE_CYPHER_KEY } from "./general.js";

export function storageGetCypherConfigured(_encr: LocalFileEncryptor): LocalFileEncryptor {
  const _item = window.localStorage.getItem(STORAGE_CYPHER_KEY)
  const encr = clone(_encr);
  if (_item === null) {
    return encr;
  }
  const item = JSON.parse(_item);

  if (_encr instanceof AESFileEncryptor) {
    const elem = item["aes"]
    const aes: AESFileEncryptor = encr as AESFileEncryptor;
    aes.secretKey = elem.secretKey;
  }

  return encr;
}

export function storageGetCyphersConfigured(encrs: LocalFileEncryptor[]): LocalFileEncryptor[] {
  return encrs.map(encr => storageGetCypherConfigured(encr));
}

export function storageSetCypherConfigured(encr: LocalFileEncryptor) {
  const _item = window.localStorage.getItem(STORAGE_CYPHER_KEY);
  let item;
  if (_item === null) {
    item = {} as any;
  } else {
    item = JSON.parse(_item);
  }

  if (encr instanceof AESFileEncryptor) {
    const elem = item["aes"] as any;
    elem.secretKey = encr.secretKey;
  }
  window.localStorage.setItem(STORAGE_CYPHER_KEY, JSON.stringify(item));
}

export function storageSetCyphersConfigured(encrs: LocalFileEncryptor[]) {
  encrs.forEach(encr => {
    storageSetCypherConfigured(encr);
  });
}