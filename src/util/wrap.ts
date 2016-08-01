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
  // cf. http://bl.ocks.org/mbostock/7555321
  text.each(function () {
    const text = d3.select(this),
        words = text.text().split(/\s+/),
        lineHeight = 1.1,
        y = text.attr('y') || 0,
        dy = parseFloat(text.attr('dy') || '0');

    let line: string[] = [],
        lineNumber = 0,
        tspan = text.text(null)
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', dy + 'em');

    for (const word of words) {
      line.push(word);
      tspan.text(line.join(' '));

      if ((tspan.node() as SVGTextElement).getComputedTextLength() > width) {
        lineNumber++;
        line.pop();
        tspan.text(line.join(' '));

        line = [word];
        tspan = text.append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', lineNumber * lineHeight + dy + 'em');
      }
    }
  });
}
