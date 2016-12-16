import {scaleSqrt} from 'd3-scale';
import {uniqueId} from 'underscore';

import configure from 'util/configure';
import D3View from 'views/d3';
import BubbleLegend from 'models/legend/bubble';

import * as template from 'text!templates/legend-bubble.html';

@configure({
  className: 'legend__item legend__item--bubble',
})
export default class BubbleLegendView<Legend extends BubbleLegend> extends D3View<HTMLDivElement, Legend> {
  template = () => template;

  protected markerStartId = uniqueId('bubble-marker-');
  protected markerEndId = uniqueId('bubble-marker-');

  render(): this {
    super.render();

    const width = 180,
          bubbleHeight = 50;

    const points = [10, 45];

    const radius = scaleSqrt()
      .domain([0, 100])
      .range([0, 36]);

    const svg = this.select('svg')
      .attr('viewBox', `0 0 ${width} 80`);

    // The orientation of an SVG <marker> element is dependent on the element to which it is attached, which means that
    // in order to do the <==> style of marker, we have to create two markers with separate orientations.
    const markerData: [string, number][] = [
      [this.markerStartId, 180],
      [this.markerEndId, 0],
    ];

    svg.selectAll('marker')
      .data(markerData)
      .attr('id', d => d[0])
      .attr('orient', d => d[1]);

    const bubbles = svg.selectAll<SVGElement, {}>('.legend__bubble')
      .data(points)
      .attr('transform', (_, i) => `translate(${i * width / 2}, 0)`);

    bubbles.select('.bubble__label')
      .attr('x', width / 4)
      .text(d => d + '%');

    bubbles.select('.bubble__bubble')
      .attr('cx', width / 4)
      .attr('cy', bubbleHeight)
      .attr('r', radius);

    const markerStart = width * 0.25 + radius(points[0]),
          markerEnd = width * 0.75 - radius(points[1]),
          // How much space to put between an arrow and a bubble.
          fudge = 7;

    svg.select('line.legend__bubble-line')
      .attr('x1', markerStart + fudge)
      .attr('y1', bubbleHeight)
      .attr('x2', markerEnd - fudge)
      .attr('y2', bubbleHeight)
      .attr('marker-start', `url(#${this.markerStartId})`)
      .attr('marker-end', `url(#${this.markerEndId})`);

    return this;
  }
}
