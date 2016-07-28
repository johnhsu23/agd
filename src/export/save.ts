import * as Promise from 'bluebird';

import {canvasFromSvg} from 'export/convert';

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

const saveMethod = typeof navigator.msSaveBlob === 'function' ? saveCanvasAsBlob : saveCanvasWithClickInject;

/**
 * Given an SVG and a filename, attempt to force the browser to download
 */
export default function save(svg: SVGSVGElement, filename = 'download'): Promise<void> {
  filename += '.png';

  return canvasFromSvg(svg)
    .then(canvas => saveMethod(canvas, filename));
}
