// import * as Promise from 'bluebird';
import {Selection} from 'd3';

import renderTitle from 'render/figure-title';
import renderLegend from 'render/figure-legend';

import ensureAttached from 'util/ensure-attached';
import save from 'export/save';

const figureWidth = 1024;

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
  legend.x.baseVal.value = figureWidth - legendWidth;
  legend.y.baseVal.value = offset;

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.x.baseVal.value = x - 1;
  rect.y.baseVal.value = offset - 1;
  rect.width.baseVal.value = legendWidth + 2;
  rect.height.baseVal.value = legendHeight + 2;
  rect.style.setProperty('stroke', 'black');
  rect.style.setProperty('stroke-width', '1px');
  rect.style.setProperty('fill', 'none');

  svg.appendChild(title);
  svg.appendChild(chart);
  svg.appendChild(rect);
  svg.appendChild(legend);

  svg.setAttribute('width', '' + (figureWidth + 1)); // +1 to account for the legend border
  svg.setAttribute('height', '' + (offset + chartHeight));

  save(svg).done();
}
