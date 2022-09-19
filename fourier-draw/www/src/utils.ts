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