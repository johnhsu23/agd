// import * as Promise from 'bluebird';
import {Selection} from 'd3';

import renderTitle from 'render/figure-title';
import renderLegend from 'render/figure-legend';

import ensureAttached from 'util/ensure-attached';
import save from 'export/save';

const figureWidth = 1024;

/**
 * Helper function: get the bounding ClientRect of an element that may not be attached to the document
 */
function metrics(node: Element): ClientRect {
  return ensureAttached(node, node => node.getBoundingClientRect());
}

export default function render<T>(figure: Selection<T>): void {
  const title = renderTitle(figure.select('.figure__title')),
        chart = figure.select('.chart').node().cloneNode(true) as SVGSVGElement,
        legend = renderLegend(figure.select('.legend'));

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  const offset = metrics(title).height;

  const {width: chartWidth, height: chartHeight} = metrics(chart),
        chartOffset = (768 - chartWidth) / 2;

  chart.x.baseVal.value = chartOffset;
  chart.y.baseVal.value = offset;

  const {width: legendWidth, height: legendHeight} = metrics(legend);

  const x = figureWidth - legendWidth;

  // legend is offset by 1 to allow border to occupy final 1px of figure
  legend.x.baseVal.value = x - 1;
  legend.y.baseVal.value = offset;

  // +/- 2 due to 1px border (need to ensure both sides are in the frame!)
  const border = makeBorder(x - 2, offset, legendWidth + 2, legendHeight + 2);

  svg.appendChild(title);
  svg.appendChild(chart);
  svg.appendChild(border);
  svg.appendChild(legend);

  svg.setAttribute('width', '' + figureWidth);
  svg.setAttribute('height', '' + (offset + chartHeight));

  save(svg).done();
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
