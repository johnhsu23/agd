import * as Promise from 'bluebird';

import cloneSvg from 'util/clone-svg';

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

/**
 * Serialize a node to a string.
 */
function serialize(node: SVGSVGElement): string {
  return new XMLSerializer()
    .serializeToString(cloneSvg(node));
}

/**
 * The data URI prefix for a base64-encoded SVG image.
 */
const prefix = 'data:image/svg+xml;base64,';

/**
 * Converts an SVG image into an HTML <img> element.
 *
 * This function exists because drawing an SVG element directly onto a <canvas> activates the taint flag,
 * which means that we can no longer read the data from it.
 *
 * The content of this function was (ahem) _borrowed_ liberally from Pablo.js: http://pablojs.com/
 */
export function imageFromSvg(svg: SVGSVGElement): Promise<HTMLImageElement> {
  // Serialize the SVG now, and read out its width and height.
  // The latter step avoids the issue of the browser adding its default dimensions.
  const data = prefix + encode(serialize(svg));
  const {width, height} = svg.getBoundingClientRect();

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = document.createElement('img');
    image.width = width;
    image.height = height;

    // Once this event fires, the image is ready for use.
    image.addEventListener('load', () => {
      resolve(image);
    });

    image.addEventListener('error', event => {
      // Bluebird doesn't like us rejecting with non-Error objects
      reject(new Error(event.message));
    });

    image.src = data;
  });
}

/**
 * Fills a canvas from an HTML <img> element.
 */
function canvasFromImage(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

  // Setup canvas dimensions
  const {width, height} = image;
  canvas.width = width;
  canvas.height = height;

  // Create blank white background
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);

  // Fill image
  context.drawImage(image, 0, 0, width, height);

  return canvas;
}

export function canvasFromSvg(svg: SVGSVGElement): Promise<HTMLCanvasElement> {
  return imageFromSvg(svg)
    .then(canvasFromImage);
}

/**
 * Given an HTML <canvas> element, download its contents using navigator.msToBlob.
 */
function saveCanvasAsBlob(canvas: HTMLCanvasElement, filename: string): void {
  // The reason we have separate code paths is because IE does not allow navigation to a "data:" URI, for security.
  // Which is fair enough, but it means that the click-injection behavior we have (see the below function) won't
  // work.
  // Hence this code.

  // Use best available `toBlob()` method
  let blob: Blob;
  if (canvas.toBlob) {
    blob = canvas.toBlob();
  } else if (canvas.msToBlob) {
    blob = canvas.msToBlob();
  } else {
    throw new Error("Can't save blob from canvas.");
  }

  // https://msdn.microsoft.com/en-us/library/windows/apps/hh441122.aspx
  navigator.msSaveBlob(blob, filename);

  // Dispose of the blob, when we can
  if (blob.msClose) {
    blob.msClose();
  }
}

function saveCanvasWithClickInject(canvas: HTMLCanvasElement, filename: string): void {
  // This works in most browsers ("most" as defined by Chrome and Firefox).
  // We generate an empty <a> element and click it. The "download" attribute requests that the browser
  // download the file instead of displaying it to the user, and the value of the attribute is a suggested
  // file name.
  const a = document.createElement('a');
  a.href = canvas.toDataURL();
  a.setAttribute('download', filename);

  const body = document.body;
  body.appendChild(a);
  a.click();
  body.removeChild(a);
}

const downloadMethod = typeof navigator.msSaveBlob === 'function' ? saveCanvasAsBlob : saveCanvasWithClickInject;

/**
 * Given an SVG and a filename, attempt to force the browser to download
 */
export function download(svg: SVGSVGElement, filename = 'download'): Promise<void> {
  filename += '.png';

  return canvasFromSvg(svg)
    .then(canvas => downloadMethod(canvas, filename));
}
