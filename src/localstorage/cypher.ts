import { Encryptor } from "../cypher/base.js";
import { STORAGE_AUTO_ENCRYPTION, STORAGE_CYPHER_KEY } from "./general.js";

export function storageGetCypherConfigured(_encr: Encryptor): Encryptor {
  const _item = window.localStorage.getItem(STORAGE_CYPHER_KEY)
  if (_item == null) {
    return _encr;
  }
  const item = JSON.parse(_item);
  return Object.assign(_encr, item[_encr.getAlgorithm()]);
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

  item[encr.getAlgorithm()] = encr;
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
