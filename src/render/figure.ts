import {Selection} from 'd3-selection';

import renderTitle from 'render/figure-title';
import renderLegend from 'render/figure-legend';

import ensureAttached from 'util/ensure-attached';

const figureWidth = 1024;

/**
 * Helper function: get the bounding ClientRect of an element that may not be attached to the document
 */
function metrics(node: Element): ClientRect {
  return ensureAttached(node, node => node.getBoundingClientRect());
}

export default function render<T, U>(figure: Selection<Element, T, null, U>): SVGSVGElement {
  const title = renderTitle(figure.select('.figure__title')),
        chart = figure.select<SVGSVGElement>('.chart').node().cloneNode(true) as SVGSVGElement;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  const offset = metrics(title).height;

  const {width: chartWidth, height: chartHeight} = metrics(chart),
        chartOffset = (768 - chartWidth) / 2;

  chart.x.baseVal.value = chartOffset;
  chart.y.baseVal.value = offset;

  svg.appendChild(title);
  svg.appendChild(chart);

  // Check if legend exists.
  const legendElement = figure.select<Element>('.legend');
  const legendNode = legendElement.node();
  if (legendNode) {
    const legend = renderLegend(legendElement);
    const {width: legendWidth, height: legendHeight} = metrics(legend);

    const x = figureWidth - legendWidth;

    // legend is offset by 1 to allow border to occupy final 1px of figure
    legend.x.baseVal.value = x - 1;
    legend.y.baseVal.value = offset;

    // +/- 2 due to 1px border (need to ensure both sides are in the frame!)
    const border = makeBorder(x - 2, offset, legendWidth + 2, legendHeight + 2);

    svg.appendChild(border);
    svg.appendChild(legend);
  }

  svg.setAttribute('width', '' + figureWidth);
  svg.setAttribute('height', '' + (offset + chartHeight));

  return svg;
}

function makeBorder(x: number, y: number, width: number, height: number): SVGRectElement {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  // dimensions
  rect.x.baseVal.value = x;
  rect.y.baseVal.value = y;
  rect.width.baseVal.value = width;
  rect.height.baseVal.value = height;

  // set inline styles to emulate the legend border
  const {style} = rect;
  style.stroke = 'black';
  style.strokeWidth = '1px';
  style.fill = 'none';

  return rect;
}
