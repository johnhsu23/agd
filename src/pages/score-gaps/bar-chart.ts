import {Selection} from 'd3-selection';
import {scaleBand} from 'd3-scale';
import {axisLeft} from 'd3-axis';

import 'd3-transition';

import configure from 'util/configure';
import wrap from 'util/wrap';
import * as vars from 'data/variables';
import Chart from 'views/chart';
import * as api from 'pages/score-gaps/bar-data';

import * as scales from 'components/scales';
import * as axis from 'components/axis';

@configure({
  className: 'chart chart--bar',
})
export default class BarChart extends Chart<api.Grouped> {
  protected marginLeft = 100;
  protected marginRight = 100;
  protected marginBottom = 40;
  protected marginTop = 0;

  protected percentAxis: Selection<SVGGElement, {}, null, void>;
  protected categoryAxis: Selection<SVGGElement, {}, null, void>;

  protected variable: vars.Variable = vars.SDRACE;
  protected data: api.Grouped;

  protected firstRender = true;

  delegateEvents(): this {
    super.delegateEvents();

    this.on('variable:select', this.onVariableSelect);

    return this;
  }

  render(): this {
    super.render();

    if (this.firstRender) {
      this.percentAxis = this.d3el.append<SVGGElement>('g');
      this.categoryAxis = this.d3el.append<SVGGElement>('g');

      this.firstRender = false;
    }

    this.renderData();

    return this;
  }

  protected onVariableSelect(variable: vars.Variable): void {
    this.variable = variable;

    this.loaded();
  }

  protected renderData(): void {
    this.data = api.load();
    this.loaded();
  }

  protected loaded(): void {

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
    const category = scaleBand()
      .domain(this.data[this.variable.id].map(d => d.name))
      .range([0, chartHeight])
      .padding(0.5);

    const categoryAxis = axisLeft(category);

    this.categoryAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(categoryAxis);

    // wrap the category names
    this.categoryAxis.selectAll('text')
      .call(wrap, this.marginLeft - 5);

    // set the bar groups
    const barUpdate = this.inner.selectAll('.gap-bar')
      .data(this.data[this.variable.id]);

    barUpdate.exit()
      .classed('is-exiting', true)
      .remove();

    barUpdate.interrupt()
      .transition()
      .attr('transform', d => `translate(0, ${category(d.name)})`);

    // add group element
    const barEnter = barUpdate.enter()
      .append('g')
      .classed('gap-bar', true)
      .attr('transform', d => `translate(0, ${category(d.name)})`);

    // add bar rect svg
    barEnter.append('rect')
      .classed('gap-bar__bar', true)
      .attr('height', category.bandwidth())
      .attr('width', 0)
      .merge(barUpdate.select('.gap-bar__bar'))
      .transition()
      .attr('height', category.bandwidth())
      .attr('width', d => percent(d.value));

    // add bar percentage text
    const barText = barEnter.append('text')
      .classed('gap-bar__text', true)
      .attr('y', d => (category.bandwidth() / 2));

    barText.merge(barUpdate.select('.gap-bar__text'))
      .transition()
      .attr('y', d => (category.bandwidth() / 2))
      .attr('x', d => percent(d.value) + 5);

    barText.append('tspan')
      .classed('gap-bar__text__value', true)
      .merge(barUpdate.select('.gap-bar__text__value'))
      .text(d => Math.round(d.value));

    // add maximum score text to focal category
    barText.data([this.data[this.variable.id][0]])
      .append('tspan')
      .classed('gap-bar__text__outer', true)
      .text('% of maximum score');
  }
}
