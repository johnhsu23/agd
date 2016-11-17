import * as Bluebird from 'bluebird';
import {Selection} from 'd3-selection';
import * as Scale from 'd3-scale';
import * as D3Axis from 'd3-axis';

import 'd3-transition';

import configure from 'util/configure';
import {Variable, SDRACE} from 'data/variables';
import Chart from 'views/chart';
import * as api from 'pages/score-gaps/bar-data';
import context from 'models/context';

import * as scales from 'components/scales';
import * as axis from 'components/axis';
import {gap as makeGap, GapPoint, PointInfo} from 'components/gap';

type Point = {
  errorFlag: number;
  category: number;
  sig: string;
};

@configure({
  className: 'chart chart--bar',
})
export default class BarChart extends Chart<api.Data> {
  protected marginLeft = 40;
  protected marginRight = 0;
  protected marginBottom = 40;
  protected marginTop = 0;

  protected xAxis: Selection<SVGGElement, {}, null, void>;
  protected yAxis: Selection<SVGGElement, {}, null, void>;
  protected gap: Selection<SVGGElement, {}, null, void>;

  protected variable: Variable = SDRACE;
  protected focal: number = 0;
  protected target: number = 1;

  protected firstRender = true;

  delegateEvents(): this {
    super.delegateEvents();

    this.on('gap:select', this.onGapSelect);

    return this;
  }

  render(): this {
    super.render();

    if (this.firstRender) {
      this.xAxis = this.d3el.append<SVGGElement>('g');
      this.yAxis = this.d3el.append<SVGGElement>('g');
      this.gap = this.inner.append<SVGGElement>('g');

      this.firstRender = false;
    }

    this.renderData().done();

    return this;
  }

  protected onGapSelect(variable: Variable, focal: number, target: number): void {
    this.variable = variable;
    this.focal = focal;
    this.target = target;

    this.renderData().done();
  }

  protected async renderData(): Bluebird<void> {
    const id = this.variable.id;

    const data = await api.load(context.subject, id, this.focal, this.target);

    return this.loaded(data);
  }

  protected loaded(data: api.Data[]): void {
    const chartHeight = 300,
          chartWidth = 400;
    this.height(chartHeight).width(chartWidth);

    // setup and add the x axis
    const x = scales.percent()
      .bounds([0, 100])
      .domain([0, 100]);

    const xAxis = axis.horizontalBottom()
      .scale(x);

    this.xAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop + this.innerHeight})`)
      .call(xAxis);

    // setup and add the y axis
    const y = Scale.scaleBand()
      .domain([data[0].category, data[0].categoryb])
      .range([0, chartHeight])
      .padding(0.5);

    const yAxis = D3Axis.axisLeft(y);

    this.yAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(yAxis);

    // setup the data
    const catA = {
      category: data[0].category,
      index: data[0].categoryindex,
      value: data[0].focalValue,
      displayable: data[0].isFocalStatDisplayable,
      errorFlag: data[0].focalErrorFlag,
    };
    const catB = {
      category: data[0].categoryb,
      index: data[0].categorybindex,
      value: data[0].targetValue,
      displayable: data[0].isTargetStatDisplayable,
      errorFlag: data[0].targetErrorFlag,
    };
    const barData = [catA, catB];

    // set the bars
    const barUpdate = this.selectAll('rect')
      .data(barData);

    barUpdate.exit()
      .classed('is-exiting', true)
      .transition()
      .remove();

    barUpdate.interrupt()
      .transition()
      .attr('y', d => y(d.category))
      .attr('x', this.marginLeft)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.value));

    barUpdate.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => y(d.category))
      .attr('x', this.marginLeft)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.value));

    // Add percentage text next to bar
    const barText = this.selectAll('.bar__text')
      .data(barData);

    barText.exit()
      .classed('is-exiting', true)
      .transition()
      .remove();

    barText.interrupt()
      .transition()
      .attr('y', d => y(d.category) + (y.bandwidth() / 2))
      .attr('x', d => x(d.value) + this.marginLeft + 5)
      .text(d => Math.round(d.value) + ((d.index === this.focal + 1) ? '% of maximum score' : ''));

    barText.enter()
      .append('text')
      .classed('bar__text', true)
      .attr('y', d => y(d.category) + (y.bandwidth() / 2))
      .attr('x', d => x(d.value) + this.marginLeft + 5)
      .text(d => Math.round(d.value) + ((d.index === this.focal + 1) ? '% of maximum score' : ''));

    // add gap
    const gapData = makeGap<Point, api.Data>()
      .x(d => x(Math.max(catA.value, catB.value) + this.marginLeft));
  }
}
