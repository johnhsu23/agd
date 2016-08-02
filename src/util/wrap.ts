import {Selection} from 'd3';

/**
 * Wraps the text inside a given SVG <text> element to fit a particular width.
 *
 * Note that the <text> elements MUST be attached to the document and visible! If not, they will have no
 * text metrics for us to measure, and this function will not wrap any text.
 *
 * @param text A selection of SVG <text> elements
 * @param width The width to constrain to
 */
export default function wrap<T>(text: Selection<T>, width: number): void {
  text.each(function () {
    const parent: SVGTextElement = this;

    const boxes: Node[] = [];
    while (parent.firstChild) {
      const node = parent.firstChild;

      if (node instanceof Text) {
        let text = node,
            result: RegExpMatchArray;

        while ((result = text.textContent.match(/\s/)) !== null) {
          text = text.splitText(result.index + 1);

          const previous = text.previousSibling;
          parent.removeChild(previous);
          boxes.push(previous);
        }

        parent.removeChild(text);
        boxes.push(text);
      } else {
        parent.removeChild(node);
        boxes.push(node);
      }
    }

    const x = parent.x.baseVal,
          y = parent.y.baseVal;

    let text = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    parent.appendChild(text);
    copyList(x, text.x.baseVal);
    copyList(y, text.y.baseVal);

    let line = 0;
    const lineHeight = 1.1;

    for (const box of boxes) {
      text.appendChild(box);

      if (text.getComputedTextLength() > width) {
        text.removeChild(box);
        line++;

        text = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        parent.appendChild(text);
        copyList(x, text.x.baseVal);
        copyList(y, text.y.baseVal);

        text.appendChild(box);
        text.setAttribute('dy', (line * lineHeight) + 'em');
      }
    }
  });
}

function copyList(source: SVGLengthList, dest: SVGLengthList): void {
  dest.clear();

  for (let i = 0; i < source.numberOfItems; i++) {
    dest.appendItem(source.getItem(i));
  }
}
