// Declare 'unescape' function for below
declare function unescape(contents: string): string;

/**
 * Base64-encodes an arbitrary string. This function wraps `btoa()` with a Unicode-safe transformation.
 *
 * On `btoa()` and Unicode: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa#Unicode_strings
 */
function encode(data: string): string {
  // NB. `unescape` is considered deprecated, so we should consider replacing this with another option.
  // `btoa()` is also not available in IE9, so it's possible that we'd be better off using base64.js
  // and a text encoder to handle the Unicode safety problem.
  //
  // cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape
  return btoa(unescape(encodeURIComponent(data)));
}

const serializer = new XMLSerializer;
export default function serialize(node: Node): string {
  return encode(serializer.serializeToString(node));
}
