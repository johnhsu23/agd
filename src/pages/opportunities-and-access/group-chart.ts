import {ViewOptions, Model} from 'backbone';
import {Selection} from 'd3-selection';
import {scaleBand} from 'd3-scale';
import {axisLeft} from 'd3-axis';

import makeStack from 'components/stack';
import * as scales from 'components/scales';
import {horizontalBottom} from 'components/axis';
import {Variable} from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';
import configure from 'util/configure';
import Chart from 'views/chart';
import wrap from 'util/wrap';

import {load, Result, Data} from 'pages/opportunities-and-access/group-data';

export interface GroupChartOptions extends ViewOptions<Model> {
  variable: Variable;
  contextualVariable: ContextualVariable;
}

@configure({
  className: 'chart chart--bar chart--bar--stacked',
})
export default class GroupChart extends Chart<Model> {
  protected marginLeft = 140;
  protected marginRight = 25;
  protected marginBottom = 30;
  protected marginTop = 80;

  protected percentAxis: Selection<SVGGElement, {}, null, void>;
  protected categoryAxis: Selection<SVGGElement, {}, null, void>;
  protected chartHeader: Selection<SVGGElement, {}, null, void>;

  protected firstRender = true;

  protected variable: Variable;
  protected contextualVariable: ContextualVariable;

  constructor(options: GroupChartOptions) {
    super(options);

    this.variable = options.variable;
    this.contextualVariable = options.contextualVariable;
  }

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
      this.chartHeader = this.d3el.append<SVGGElement>('g');

      // apply a white background on first render
      this.selectAll('.background')
        .data([0])
        .enter().insert('rect', '.chart__inner')
          .classed('background', true)
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('fill', 'white');

      this.firstRender = false;
    }

    return this;
  }

  onRender(): void {
    this.updateData();
  }

  protected onVariableSelect(variable: Variable): void {
    this.variable = variable;

    this.updateData();
  }

  protected updateData(): void {
    load(this.variable, this.contextualVariable)
      .then(data => this.loaded(data))
      .done();
  }

  protected loaded(data: Result[]): void {
    // setup and add the x axis
    const percent = scales.percent()
      .domain([0, 100]);

    const percentAxis = horizontalBottom()
      .scale(percent);

    // set chart height and width
    const chartHeight = 300,
        chartWidth = percent.size();

    this.height(chartHeight)
      .width(chartWidth);

    this.percentAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop + this.innerHeight})`)
      .call(percentAxis);

    // setup and add the y axis
    const category = scaleBand()
      .domain(data.map(d => d.key))
      .range([0, chartHeight])
      .padding(0.2);

    const categoryAxis = axisLeft(category);

    this.categoryAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(categoryAxis);

    // wrap the category names
    this.categoryAxis.selectAll('text')
      .call(wrap, this.marginLeft - 15);

    // set series group
    const seriesUpdate = this.inner.selectAll('.series')
      .data(data);

    seriesUpdate.interrupt()
      .transition()
        .attr('transform', d => `translate(0, ${category(d.key)})`);

    // add series group element
    const seriesEnter = seriesUpdate.enter()
      .append('g')
        .attr('class', (_, i) => `series series--${i}`)
        .attr('transform', d => `translate(0, ${category(d.key)})`);

    const stack = makeStack<Data>()
      .defined(d => d.isStatDisplayable !== 0)
      .size(d => percent(d.value));

    const merged = seriesUpdate.merge(seriesEnter);

    // set bar group
    const barUpdate = merged.selectAll('.bar')
      .data(d => stack(d.values));

    barUpdate.interrupt()
      .transition()
        .attr('transform', d => `translate(${d.offset})`);

    // add bar group
    const barEnter = barUpdate.enter()
      .append('g')
        .attr('class', (_, i) => `bar bar--${i}`)
        .attr('transform', d => `translate(${d.offset})`);

    // add bar rect svg
    barEnter.append('rect')
        .classed('bar__bar', true)
        .attr('width', d => d.size)
        .attr('height', category.bandwidth())
      .merge(barUpdate.select('.bar__bar'))
      .transition()
        .attr('height', category.bandwidth())
        .attr('width', d => d.size);

    // add bar text
    barEnter.append('text')
        .classed('bar__text', true)
        .attr('x', d => d.size / 2)
        .attr('y', category.bandwidth() / 2)
        .attr('dy', '0.37em')
        .text(d => Math.round(d.value))
      .merge(barUpdate.select('.bar__text'))
      .transition()
        .attr('x', d => d.size / 2)
        .attr('y', category.bandwidth() / 2)
        .attr('dy', '0.37em')
        .text(d => Math.round(d.value));

    // handle the exit transitions for the elements
    const seriesExit = seriesUpdate.exit()
      .transition()
      .remove();

    seriesExit.select('.bar')
      .attr('transform', 'translate(0)');

    seriesExit.selectAll('.bar__bar')
      .attr('width', 0);

    seriesExit.selectAll('bar__text')
      .attr('x', 0);
  }
}
