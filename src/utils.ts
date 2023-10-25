export function loadScript(src: string, onLoad: () => void) {
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
