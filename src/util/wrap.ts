import {Selection} from 'd3-selection';

/**
 * Wraps the text inside a given SVG `<text>` element to fit a particular width.
 *
 * Note that the `<text>` elements MUST be attached to the document and visible! If not, they will have no
 * text metrics for us to measure, and this function will not wrap any text.
 *
 * @param text A selection of SVG <text> elements
 * @param width The width to constrain to
 */
export default function wrap<T, U>(text: Selection<SVGTextElement, T, null, U>, width: number): void {
  text.each(function () {
    const boxes: Node[] = [];
    while (this.firstChild) {
      const node = this.firstChild;

      if (node instanceof Text) {
        let text = node,
            result: RegExpMatchArray;

        // Split on:
        // * whitespace
        // * hyphens
        // * forward slashes
        while ((result = text.textContent.match(/[\s-\/]/)) !== null) {
          text = text.splitText(result.index + 1);

          const previous = text.previousSibling;
          this.removeChild(previous);
          boxes.push(previous);
        }

        this.removeChild(text);
        boxes.push(text);
      } else {
        // Treat non-Text children as their own box; this allows us to wrap around pre-existing <tspan>s
        // (such as in the case of having to format the 'p' in 'p < .05).
        this.removeChild(node);
        boxes.push(node);
      }
    }

    let text = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    this.appendChild(text);
    text.setAttribute('x', this.getAttribute('x') || '0');
    text.setAttribute('y', this.getAttribute('y') || '0');
    let line = 0;
    const lineHeight = 1.1;

    for (const box of boxes) {
      text.appendChild(box);

      if (text.getComputedTextLength() > width) {
        line++;

        // If a single word overflows the text element, force it to be output in its own line
        const shouldMove = text.childNodes.length > 1;
        if (shouldMove) {
          text.removeChild(box);
        }

        // Trim whitespace at the end of a line.
        // Doing this here instead of earlier does mean that text metrics are slightly off, but taking the action at all
        // will help ease some of the more pathological cases of long words wrapped to fairly narrow column widths.
        text.textContent = text.textContent.trim();

        // Allocate a new line
        text = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        this.appendChild(text);
        text.setAttribute('x', this.getAttribute('x') || '0');
        text.setAttribute('y', this.getAttribute('y') || '0');

        if (shouldMove) {
          // This is the second half of the move operation from above, so it only
          // occurs if we removed the box from the previous `text' element.
          text.appendChild(box);
        }
        text.setAttribute('dy', (line * lineHeight) + 'em');
      }
    }
  });
}
