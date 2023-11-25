import CryptoJS from 'crypto-js';
import { LocalFile } from './localfile.js';

export async function loadScript(src: string, onLoad: () => void) {
  let script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true
  script.onload = onLoad
  document.body.append(script);
}

export function matchesClassNames(pe: Element[], classNames: string[]) {
  let classNames_ = [...classNames]

  if (pe === null) {
    return false;
  }

  for (const elem of pe) {
    const iof = classNames_.indexOf(elem.className);
    if (iof != -1) {
      classNames_.splice(iof, 1);
    }
  }

  return classNames_.length == 0;
}

export async function readStreamChunks(stream: ReadableStream<Uint8Array>) {
  const chunks = [];
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
    }

    return chunks;

  } finally {
    reader.releaseLock();
  }
}

export function base64ToBytes(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0))
}

export function bytesToBase64(bytes: Uint8Array): string {
  var binary = '';
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function bytesArrToBase64(bytesArr: Uint8Array[]): string {
  const binString = bytesArr.map((bytes) => bytesToBase64(bytes)).join('')
  return btoa(binString);
}

export function Uint8ArrayToCryptJsWordArray(u8Array: Uint8Array) {
  return CryptoJS.lib.WordArray.create(u8Array as any);
}

export function CryptJsWordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
  const l = wordArray.sigBytes;
  const words = wordArray.words;
  const result = new Uint8Array(l);
  var i = 0 /*dst*/, j = 0 /*src*/;
  while (true) {
    // here i is a multiple of 4
    if (i == l)
      break;
    var w = words[j++];
    result[i++] = (w & 0xff000000) >>> 24;
    if (i == l)
      break;
    result[i++] = (w & 0x00ff0000) >>> 16;
    if (i == l)
      break;
    result[i++] = (w & 0x0000ff00) >>> 8;
    if (i == l)
      break;
    result[i++] = (w & 0x000000ff);
  }
  return result;
}

export function until(cond: () => boolean) {

  const poll = (resolve: any) => {
    if (cond()) resolve();
    else setTimeout((_: any) => poll(resolve), 400);
  }

  return new Promise(poll);
}

export function clone<T>(obj: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj)
}

export function min<T>(left: T, right: T): T {
  if (left > right) {
    return right;
  }
  return left;
}

export function max<T>(left: T, right: T): T {
  if (left < right) {
    return right;
  }
  return left;
}

export function mergeUint8Array(arrays: Uint8Array[]) {
  // Get the total length of all arrays.
  let length = 0;
  arrays.forEach(item => {
    length += item.length;
  });

  // Create a new array with total length and merge all source arrays.
  let mergedArray = new Uint8Array(length);
  let offset = 0;
  arrays.forEach(item => {
    mergedArray.set(item, offset);
    offset += item.length;
  });
  return mergedArray;
}

export function downloadFile(file: LocalFile) {
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(file.getFile());
  downloadLink.setAttribute('download', '');
  downloadLink.style.visibility = 'none';
  downloadLink.style.position = 'absolute';
  downloadLink.target = "_blank";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

