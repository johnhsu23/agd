import {select, Selection, BaseType} from 'd3-selection';

import wrap from 'util/wrap';
import ensureAttached from 'util/ensure-attached';

const figureWidth = 1024;

export default function render<T, U>(text: Selection<BaseType, T, null, U>): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  return ensureAttached(svg, svg => {
    const sel = select(svg);

    sel
      .append('text')
      .text(text.text())
      .attr('y', '1em')
      .attr('class', 'figure__title')
      .call(wrap, figureWidth);

    const lines = sel.selectAll('tspan').size();
    sel
      .attr('width', figureWidth)
      .attr('height', (lines * 1.1) + 'em');

    return svg;
  });
}
