import {Selection} from 'd3-selection';

/**
 * Wraps the text inside a given SVG <text> element to fit a particular width.
 *
 * Note that the <text> elements MUST be attached to the document and visible! If not, they will have no
 * text metrics for us to measure, and this function will not wrap any text.
 *
 * @param text A selection of SVG <text> elements
 * @param width The width to constrain to
 */
export default function wrap<T, U>(text: Selection<SVGTextElement, T, null, U>, width: number): void {
  text.each(function (this: SVGTextElement) {
    const boxes: Node[] = [];
    while (this.firstChild) {
      const node = this.firstChild;

      if (node instanceof Text) {
        let text = node,
            result: RegExpMatchArray;

        while ((result = text.textContent.match(/\s/)) !== null) {
          text = text.splitText(result.index + 1);

          const previous = text.previousSibling;
          this.removeChild(previous);
          boxes.push(previous);
        }

        this.removeChild(text);
        boxes.push(text);
      } else {
        this.removeChild(node);
        boxes.push(node);
      }
    }

    const x = this.x.baseVal,
          y = this.y.baseVal;

    let text = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    this.appendChild(text);
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
        this.appendChild(text);
        copyList.call(this, x, text.x.baseVal);
        copyList.call(this, y, text.y.baseVal);

        text.appendChild(box);
        text.setAttribute('dy', (line * lineHeight) + 'em');
      }
    }
  });
}

function copyList(this: SVGTextContentElement, source: SVGLengthList, dest: SVGLengthList): void {
  if (source.numberOfItems === 0) {
    const length = this.ownerSVGElement.createSVGLength();
    length.value = 0;

    dest.initialize(length);
    return;
  }

  dest.clear();
  for (let i = 0; i < source.numberOfItems; i++) {
    dest.appendItem(source.getItem(i));
  }
}
