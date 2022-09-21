export function convertTermStringToInteger(termStr: string): number {
  /**
   * Returns integer converted from termStr.
   * If termStr is an invalid string as Number or is not an integer between 1 to 100000,
   *    return -1
   */

  if (termStr.length == 0 || termStr.length >= 7) {
    return -1;
  }
  
  const converted = Number(termStr);

  if (isNaN(converted) || !Number.isInteger(converted)) {
    return -1;
  }

  return converted;
}

export function convertByteArrayToBase64(byteArray: Uint8Array): string {
  return window.btoa(String.fromCharCode(...byteArray));
}

export function convertBase64ToByteArray(base64Str: string): Uint8Array | undefined {
  const raw: string = window.atob(base64Str);
  try {
    const byteArray = new Uint8Array(raw.split("").map(c => c.charCodeAt(0)));
    return byteArray;
  } catch (e) {
    return undefined;
  }
}

export function concatUint8Array(arrays: Uint8Array[]): Uint8Array {
  const sum_len = arrays.map(arr => arr.length).reduce((sum, cur) => sum + cur);

  const ret = new Uint8Array(sum_len);
  arrays.reduce((now_len: number, arr: Uint8Array) => {
    ret.set(arr, now_len);
    return now_len + arr.length;
  }, 0);

  return ret;
}