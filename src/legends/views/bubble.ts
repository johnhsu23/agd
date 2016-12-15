import {scaleSqrt} from 'd3-scale';
import {uniqueId} from 'underscore';

import configure from 'util/configure';
import D3View from 'views/d3';
import BubbleLegend from 'legends/models/bubble';

@configure({
  className: 'legend__item',
})
export default class BubbleLegendView extends D3View<HTMLDivElement, BubbleLegend> {
  protected markerStartId = uniqueId('bubble-marker-');
  protected markerEndId = uniqueId('bubble-marker-');

  render(): this {
    super.render();

    const el = this.d3el;

    const width = 180,
          bubbleHeight = 50;

    const points = [10, 45];

    const radius = scaleSqrt()
      .domain([0, 100])
      .range([0, 36]);

    const svg = el.append('svg')
      .attr('viewBox', `0 0 ${width} 80`);

    // The orientation of an SVG <marker> element is dependent on the element to which it is attached, which means that
    // in order to do the <==> style of marker, we have to create two markers with separate orientations.
    const markerData: [string, number][] = [
      [this.markerStartId, 180],
      [this.markerEndId, 0],
    ];

    svg.append('defs')
      .selectAll('marker')
      .data(markerData)
      .enter()
      .append('marker')
      .attr('id', d => d[0])
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', d => d[1])
      .append('path')
      .classed('legend__bubble-line', true)
      // Draws a small triangle
      .attr('d', 'M0 0 L10 5 L0 10z');

    const bubbles = svg.selectAll('.legend__bubble')
      .data(points)
      .enter()
      .append('g')
      .classed('legend__bubble', true)
      .attr('transform', (_, i) => `translate(${i * width / 2}, 0)`);

    bubbles.append('text')
      .classed('bubble__label', true)
      .style('text-anchor', 'middle')
      .attr('x', width / 4)
      .attr('y', '1em')
      .text(d => d + '%');

    bubbles.append('circle')
      .classed('bubble__bubble', true)
      .attr('cx', width / 4)
      .attr('cy', bubbleHeight)
      .attr('r', radius);

    const markerStart = width * 0.25 + radius(points[0]),
          markerEnd = width * 0.75 - radius(points[1]),
          // How much space to put between an arrow and a bubble.
          fudge = 7;

    svg.append('line')
      .classed('legend__bubble-line', true)
      .attr('x1', markerStart + fudge)
      .attr('y1', bubbleHeight)
      .attr('x2', markerEnd - fudge)
      .attr('y2', bubbleHeight)
      .attr('marker-start', `url(#${this.markerStartId})`)
      .attr('marker-end', `url(#${this.markerEndId})`);

    el.append('div')
      .classed('legend__description', true)
      .text('Bubble size represents percentage of students.');

    return this;
  }
}
