import CryptoJS from 'crypto-js';

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
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0)!);
}

export function bytesToBase64(bytes: Uint8Array): string {
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

export function bytesArrToBase64(bytesArr: Uint8Array[]): string {
  const binString = bytesArr.map((bytes) => String.fromCodePoint(...bytes)).join('')
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
