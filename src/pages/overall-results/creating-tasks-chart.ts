import {Model} from 'backbone';
import {Selection} from 'd3-selection';
import {scaleBand} from 'd3-scale';
import {axisLeft} from 'd3-axis';

import 'd3-transition';

import configure from 'util/configure';
import Chart from 'views/chart';
import {load, Data} from 'pages/overall-results/creating-tasks-data';

import * as scales from 'components/scales';
import * as axis from 'components/axis';

@configure({
  className: 'chart chart--bar',
})
export default class BarChart extends Chart<Model> {
  protected marginLeft = 100;
  protected marginRight = 100;
  protected marginBottom = 40;
  protected marginTop = 0;

  protected percentAxis: Selection<SVGGElement, {}, null, void>;
  protected yearAxis: Selection<SVGGElement, {}, null, void>;

  protected firstRender = true;

  render(): this {
    super.render();

    if (this.firstRender) {
      this.percentAxis = this.d3el.append<SVGGElement>('g');
      this.yearAxis = this.d3el.append<SVGGElement>('g');

      this.firstRender = false;
    }

    load()
      .then(data => this.loaded(data))
      .done();

    return this;
  }

  protected loaded(data: Data[]): void {

    // setup and add the x axis
    const percent = scales.percent()
      .bounds([0, 100])
      .domain([0, 100]);

    const percentAxis = axis.horizontalBottom()
      .scale(percent);

    const chartHeight = 300,
        chartWidth = percent.range()[1];

    this.height(chartHeight)
      .width(chartWidth);

    this.percentAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop + this.innerHeight})`)
      .call(percentAxis);

    // setup and add the y axis
    const year = scaleBand<number>()
      .domain(data.map(d => d.targetyear))
      .range([0, chartHeight])
      .padding(0.5);

    const yearAxis = axisLeft(year);

    this.yearAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(yearAxis);

    // set the bar groups
    const barUpdate = this.inner.selectAll('.bar')
      .data(data);

    barUpdate.interrupt()
      .transition()
      .attr('transform', d => `translate(0, ${year(d.targetyear)})`);

    // add group element
    const barEnter = barUpdate.enter()
      .append('g')
      .classed('bar', true)
      .attr('transform', d => `translate(0, ${year(d.targetyear)})`);

    // add bar rect svg
    barEnter.append('rect')
      .classed('bar__bar', true)
      .attr('height', year.bandwidth())
      .attr('width', 0)
      .merge(barUpdate.select('.bar__bar'))
      .transition()
      .attr('width', d => percent(d.targetvalue));

    // add bar percentage text
    const barText = barEnter.append('text')
      .classed('bar__text', true)
      .attr('y', year.bandwidth() / 2);

    barText.merge(barUpdate.select('.bar__text'))
      .transition()
      .attr('x', d => percent(d.targetvalue) + 5);

    barText.append('tspan')
      .classed('bar__text__value', true)
      .merge(barUpdate.select('.bar__text__value'))
      .text(d => Math.round(d.targetvalue));

    // add maximum score text to focal category
    barText.data([data[0]])
      .append('tspan')
      .classed('bar__text__outer', true)
      .text('% of maximum score');
  }
}
