/**
 * Convert UTF-8 string to UTF-16 string.
 * @param text string that needs to be converted to UTF-16
 * @returns string converted to UFT-16
 */
export default (text: string): string => {
  return Buffer.from(text, 'ucs2').toString('binary');
};
