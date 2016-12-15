import {Model} from 'backbone';

import {configure} from 'util/configure';
import D3View from 'views/d3';
import {scaleLinear} from 'd3-scale';

import * as template from 'text!templates/question-header-bar.html';

@configure({
  className: 'header-bar',
})
export default class HeaderBar extends D3View<HTMLDivElement, Model> {
  template = () => template;

  // height and width variables for chart and bar use
  protected chartHeight = 42;
  protected chartWidth = 133;
  protected barHeight = 32;
  protected barWidth = this.chartWidth - 1; // accommodates for stroke-width

  // set scale to be like percent
  protected scale = scaleLinear()
      .domain([0, 100])
      .range([0, this.barWidth]);

  render(): this {
    super.render();

    this.drawChart();

    return this;
  }

  protected drawChart(): void {

    // set SVG height and width
    const svg = this.d3el.select('svg')
      .attr('height', this.chartHeight)
      .attr('width', this.chartWidth);

    // place background and percentage bar
    const bar = svg.selectAll('rect')
      // intialize our bars as 100 for background and 0 for percent bar
      .data([this.scale(100), this.scale(0)]);

    bar.enter()
      .append('rect')
        .attr('x', 0)
        .attr('y', (this.chartHeight - this.barHeight) / 2)
        .attr('class', (_, i) => (i === 0) ? 'bar__background' : 'bar__percent')
        .attr('width', d => d)
        .attr('height', this.barHeight);

    // place y axis manually
    const yAxis = svg.selectAll('line')
      .data([0]);

    yAxis.enter()
      .append('line')
      .classed('y-axis', true)
      .attr('y2', this.chartHeight);
  }

  public updateChart(value: number, category: string): void {
    // update the percent bar
    this.d3el.select('.bar__percent')
      .transition()
        .attr('width', this.scale(value));

    // set text elements in accordion header associated with chart
    this.$('.header-bar-label__value')
      .text(Math.round(value));

    this.$('.header-bar-label__category')
      .text(category);
  }
}
