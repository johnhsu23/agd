import * as Bluebird from 'bluebird';
import {Selection} from 'd3-selection';
import * as Scale from 'd3-scale';
import * as D3Axis from 'd3-axis';
import {symbolCircle as gapCircle} from 'd3-shape';

import 'd3-transition';

import configure from 'util/configure';
import {Variable, SDRACE} from 'data/variables';
import Chart from 'views/chart';
import * as api from 'pages/score-gaps/bar-data';
import context from 'models/context';
import {formatGap} from 'codes';

import * as scales from 'components/scales';
import * as axis from 'components/axis';
import {symbol as makeSymbol, gapDiamond} from 'components/symbol';

type Point = {
  errorFlag: number;
  category: number;
  sig: string;
};

const gapSymbol = makeSymbol()
  .size(1000)
  .type(d => {
    if (d.sig === '<' || d.sig === '>') {
      return gapCircle;
    } else {
      return gapDiamond;
    }
  });

@configure({
  className: 'chart chart--bar',
})
export default class BarChart extends Chart<api.Data> {
  protected marginLeft = 100;
  protected marginRight = 0;
  protected marginBottom = 40;
  protected marginTop = 0;

  protected xAxis: Selection<SVGGElement, {}, null, void>;
  protected yAxis: Selection<SVGGElement, {}, null, void>;

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
      displayable: data[0].isFocalStatDisplayable !== 0,
      errorFlag: data[0].focalErrorFlag,
    };
    const catB = {
      category: data[0].categoryb,
      index: data[0].categorybindex,
      value: data[0].targetValue,
      displayable: data[0].isTargetStatDisplayable !== 0,
      errorFlag: data[0].targetErrorFlag,
    };
    const barData = [catA, catB];

    // set the bars
    const barUpdate = this.inner.selectAll('rect')
      .data(barData);

    barUpdate.exit()
      .classed('is-exiting', true)
      .transition()
      .delay(250)
      .remove();

    barUpdate.interrupt()
      .transition()
      .attr('y', d => y(d.category))
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.value));

    barUpdate.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => y(d.category))
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.value));

    // Add percentage text next to bar
    const barText = this.inner.selectAll('.bar__text')
      .data(barData);

    barText.exit()
      .classed('is-exiting', true)
      .transition()
      .remove();

    barText.interrupt()
      .transition()
      .attr('y', d => y(d.category) + (y.bandwidth() / 2))
      .attr('x', d => x(d.value) + 5)
      .text(d => Math.round(d.value) + ((d.index === this.focal + 1) ? '% of maximum score' : ''));

    barText.enter()
      .append('text')
      .classed('bar__text', true)
      .attr('y', d => y(d.category) + (y.bandwidth() / 2))
      .attr('x', d => x(d.value) + 5)
      .text(d => Math.round(d.value) + ((d.index === this.focal + 1) ? '% of maximum score' : ''));

    // Add gap point and text
    const gapData = {
      value: data[0].gap,
      sig: data[0].sig,
      displayable: data[0].isSigDisplayable !== 0,
    };

    const markerUpdate = this.inner.selectAll('.gap-marker')
      .data([gapData]);

    markerUpdate.exit()
      .classed('is-exiting', true)
      .transition()
      .delay(250)
      .remove();

    markerUpdate.interrupt()
      .transition()
      .attr('transform', d => `translate(${x(Math.max(catA.value, catB.value)) + 15}, ${this.innerHeight / 2})`);

    const markerEnter = markerUpdate.enter()
      .append('g')
      .classed('gap-marker', true);

    markerEnter.merge(markerUpdate)
      .classed('gap-marker--significant', d => d.sig === '<' || d.sig === '>')
      .classed('gap-marker--not-significant', d => d.sig !== '<' && d.sig !== '>')
      .attr('transform', d => `translate(${x(Math.max(catA.value, catB.value)) + 15}, ${this.innerHeight / 2})`);

    // add gap symbol
    markerEnter.append('path')
      .classed('gap-marker__marker', true)
      .merge(markerUpdate.select('.gap-marker__marker'))
      .attr('d', gapSymbol);

    // add gap value text
    markerEnter.append('text')
      .classed('gap-marker__text', true)
      .attr('y', '6px')
      .merge(markerUpdate.select('.gap-marker__text'))
      .text(d => formatGap(d.value, ''));

    // add outer gap text
    markerEnter.append('text')
      .classed('gap-marker__outer-text', true)
      .attr('y', '6px')
      .attr('x', '20px')
      .merge(markerUpdate.select('.gap-marker__outer-text'))
      .text('percentage point gap');
  }
}
