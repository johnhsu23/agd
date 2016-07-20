/**
 * Formats a list to a string using English conventions.
 * 
 * Examples:
 * - `formatList([1])` ==> `1`
 * - `formatList([1, 2])` ==> `1 and 2`
 * - `formatList([1, 2, 3])` ==> `1, 2, and 3`
 */
export default function formatList<T>(list: T[]): string {
  if (!list) {
    return '';
  }

  const length = list.length;
  switch (length) {
    case 0:
      return '';

    case 1:
      return '' + list[0];

    case 2:
      const [a, b] = list;
      return a + ' and ' + b;

    default:
      let output = '';
      for (let i = 0; i < length - 1; i++) {
        output += list[i] + ', ';
      }

      output += 'and ' + list[length - 1];
      return output;
  }
}
