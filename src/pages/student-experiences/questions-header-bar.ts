import {ViewOptions, Model} from 'backbone';

import configure from 'util/configure';
import D3View from 'views/d3';
import {scaleLinear} from 'd3-scale';

import {ContextualVariable} from 'data/contextual-variables';

import {load, Data} from 'pages/student-experiences/questions-header-data';
import * as template from 'text!templates/questions-header-bar.html';

export interface QuestionsHeaderBarOptions extends ViewOptions<Model> {
  variable: ContextualVariable;
}

@configure({
  className: 'header-bar',
})
export default class HeaderBar extends D3View<HTMLDivElement, Model> {
  template = () => template;

  protected variable: ContextualVariable;

  constructor(options: QuestionsHeaderBarOptions) {
    super(options);

    this.variable = options.variable;
  }

  render(): this {
    super.render();

    load(this.variable)
      .then(data => this.loaded(data[0]))
      .done();

    return this;
  }

  protected loaded(data: Data): void {
    // height and width variables for chart and bar use
    const chartHeight = 42,
      chartWidth = 133,
      barHeight = 32,
      barWidth = chartWidth - 1; // accommodates for stroke-width

    // set SVG height and width
    const svg = this.d3el.select('svg')
      .attr('height', chartHeight)
      .attr('width', chartWidth);

    // set our scale for percentages
    const scale = scaleLinear()
      .domain([0, 100])
      .range([0, barWidth]);

    // place background and percentage bar
    const bar = svg.selectAll('rect')
      .data([scale(100), scale(data.targetvalue)]);

    bar.enter()
      .append('rect')
        .attr('x', 0)
        .attr('y', (chartHeight - barHeight) / 2)
        .attr('class', (_, i) => (i === 0) ? 'bar__background' : 'bar__percent')
        .attr('width', (d, i) => (i === 0) ? d : 0)
        .attr('height', barHeight)
      .transition()
        .attr('width', d => d);

    // place y axis manually
    const yAxis = svg.selectAll('line')
      .data([0]);

    yAxis.enter()
      .append('line')
      .classed('y-axis', true)
      .attr('y2', chartHeight);

    // set text elements
    this.select('.header-bar-label__value')
      .text(Math.round(data.targetvalue));

    this.select('.header-bar-label__category')
      .text(this.variable.categories[data.categoryindex]);
  }
}
