import * as Promise from 'bluebird';

import {canvasFromSvg} from 'export/convert';

/**
 * Turn a canvas into a blob, respecting prefixed versions that don't match the `HTMLCanvasElement#toBlob` spec.
 */
function toBlob(canvas: HTMLCanvasElement, callback: (blob: Blob) => any): void {
  if (canvas.toBlob) {
    canvas.toBlob(callback);
  } else if (canvas.msToBlob) {
    callback(canvas.msToBlob());
  } else {
    throw new Error("Can't save blob from canvas");
  }
}

/**
 * Given an HTML `<canvas>` element, download its contents using `navigator.msToBlob`.
 */
function saveCanvasAsBlob(canvas: HTMLCanvasElement, filename: string): void {
  // The reason we have separate code paths is because IE does not allow navigation to a "data:" URI, for security.
  // Which is fair enough, but it means that the click-injection behavior we have (see the below function) won't
  // work.
  //
  // Hence this code.

  toBlob(canvas, blob => {
    navigator.msSaveBlob(blob, filename);
  });
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

const saveMethod = typeof navigator.msSaveBlob === 'function' ? saveCanvasAsBlob : saveCanvasWithClickInject;

/**
 * Given an SVG and a filename, attempt to force the browser to download
 */
export default function save(svg: SVGSVGElement, filename = 'download'): Promise<void> {
  filename += '.png';

  return canvasFromSvg(svg)
    .then(canvas => saveMethod(canvas, filename));
}
