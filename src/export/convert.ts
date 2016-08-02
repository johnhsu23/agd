import * as Promise from 'bluebird';

import clone from 'export/clone';
import serialize from 'export/serialize';
import ensureAttached from 'util/ensure-attached';

/**
 * The data URI prefix for a base64-encoded SVG image.
 */
const prefix = 'data:image/svg+xml;base64,';

/**
 * Converts an SVG image into an HTML `<img>` element.
 *
 * This function exists because drawing an SVG element directly onto a `<canvas>` activates the taint flag,
 * which means that we can no longer read the data from it.
 *
 * The content of this function was (ahem) _borrowed_ liberally from Pablo.js: http://pablojs.com/
 */
export function imageFromSvg(svg: SVGSVGElement): Promise<HTMLImageElement> {
  // Serialize the SVG now, and read out its width and height.
  // The latter step avoids the issue of the browser adding its default dimensions.
  // (As usual, we have to make sure the SVG element is attached before we determine its metrics.)
  const data = prefix + serialize(clone(svg));
  const {width, height} = ensureAttached(svg, svg => svg.getBoundingClientRect());

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = document.createElement('img');
    image.width = Math.ceil(width);
    image.height = Math.ceil(height);

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
 * Fills a canvas from an HTML `<img>` element.
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
