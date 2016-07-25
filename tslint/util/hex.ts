const HEX_DIGITS = '0123456789abcdef';

/**
 * Convert an integer value to a string of hexadecimal digits.
 */
function toHex(value: number): string {
  // Holds an array of hex nibbles (4-bit quantities)
  let output: string[] = [];
  value |= 0;

  // Not particularly efficient, but oh well.
  // I'm going to pretend that it's more concise this way.
  while (value !== 0) {
    let ch = HEX_DIGITS.charAt(value & 0x0F);
    output.push(ch);

    value >>= 4;
  }

  // Since we built the array up in reverse, we have to reorder it here.
  return output.reverse()
    .join('');
}

export default toHex;
