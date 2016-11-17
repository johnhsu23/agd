import {Selection} from 'd3-selection';
import {scaleBand} from 'd3-scale';
import {axisLeft} from 'd3-axis';
import {symbolCircle as gapCircle} from 'd3-shape';

import 'd3-transition';

import configure from 'util/configure';
import wrap from 'util/wrap';
import {Variable, SDRACE} from 'data/variables';
import Chart from 'views/chart';
import * as api from 'pages/score-gaps/bar-data';
import context from 'models/context';
import {formatGap} from 'codes';

import * as scales from 'components/scales';
import * as axis from 'components/axis';
import {symbol as makeSymbol, gapDiamond} from 'components/symbol';

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

  protected percentAxis: Selection<SVGGElement, {}, null, void>;
  protected categoryAxis: Selection<SVGGElement, {}, null, void>;

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
      this.percentAxis = this.d3el.append<SVGGElement>('g');
      this.categoryAxis = this.d3el.append<SVGGElement>('g');

      this.firstRender = false;
    }

    this.renderData();

    return this;
  }

  protected onGapSelect(variable: Variable, focal: number, target: number): void {
    this.variable = variable;
    this.focal = focal;
    this.target = target;

    this.renderData();
  }

  protected renderData(): void {
    api.load(context.subject, this.variable.id, this.focal, this.target)
      .then(data => this.loaded(data[0]))
      .done();
  }

  protected loaded(data: api.Data): void {
    const chartHeight = 300,
          chartWidth = 400;
    this.height(chartHeight).width(chartWidth);

    // setup and add the x axis
    const percent = scales.percent()
      .bounds([0, 100])
      .domain([0, 100]);

    const percentAxis = axis.horizontalBottom()
      .scale(percent);

    this.percentAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop + this.innerHeight})`)
      .call(percentAxis);

    // setup and add the y axis
    const category = scaleBand()
      .domain([data.category, data.categoryb])
      .range([0, chartHeight])
      .padding(0.5);

    const categoryAxis = axisLeft(category);

    this.categoryAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(categoryAxis);

    // wrap the category names
    this.categoryAxis.selectAll('text')
      .call(wrap, this.marginLeft - 5);

    // setup the data
    const catA = {
      category: data.category,
      index: data.categoryindex,
      value: data.focalValue,
      displayable: data.isFocalStatDisplayable !== 0,
      errorFlag: data.focalErrorFlag,
    };
    const catB = {
      category: data.categoryb,
      index: data.categorybindex,
      value: data.targetValue,
      displayable: data.isTargetStatDisplayable !== 0,
      errorFlag: data.targetErrorFlag,
    };
    const barData = [catA, catB];

    // set the bar groups
    const barUpdate = this.inner.selectAll('.gap-bar')
      .data(barData);

    barUpdate.interrupt()
      .transition()
      .attr('transform', d => `translate(0, ${category(d.category)})`);

    // add group element
    const barEnter = barUpdate.enter()
      .append('g')
      .classed('gap-bar', true)
      .attr('transform', d => `translate(0, ${category(d.category)})`);

    barEnter.merge(barUpdate);

    // add bar rect svg
    barEnter.append('rect')
      .classed('gap-bar__bar', true)
      .merge(barUpdate.select('.gap-bar__bar'))
      .transition()
      .attr('height', category.bandwidth())
      .attr('width', d => percent(d.value));

    // add bar percentage text
    barEnter.append('text')
      .classed('gap-bar__text', true)
      .merge(barUpdate.select('.gap-bar__text'))
      .transition()
      .attr('y', d => (category.bandwidth() / 2))
      .attr('x', d => percent(d.value) + 5)
      .text(d => Math.round(d.value) + ((d.index === this.focal + 1) ? '% of maximum score' : ''));

    // Add gap point and text
    const markerUpdate = this.inner.selectAll('.gap-marker')
      .data([data]);

    markerUpdate.interrupt()
      .transition()
      .attr('transform', d => `translate(${percent(Math.max(catA.value, catB.value)) + 15}, ${this.innerHeight / 2})`);

    const markerEnter = markerUpdate.enter()
      .append('g')
      .classed('gap-marker', true)
      .attr('transform', d => `translate(${percent(Math.max(catA.value, catB.value)) + 15}, ${this.innerHeight / 2})`);

    markerEnter.merge(markerUpdate)
      .classed('gap-marker--significant', d => d.sig === '<' || d.sig === '>')
      .classed('gap-marker--not-significant', d => d.sig !== '<' && d.sig !== '>');

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
      .text(d => formatGap(d.gap, ''));

    // add outer gap text
    markerEnter.append('text')
      .classed('gap-marker__outer-text', true)
      .attr('y', '6px')
      .attr('x', '20px')
      .merge(markerUpdate.select('.gap-marker__outer-text'))
      .text('percentage point gap');
  }
}
