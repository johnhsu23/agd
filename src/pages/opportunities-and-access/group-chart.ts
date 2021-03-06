import {ViewOptions, Model} from 'backbone';
import {Selection} from 'd3-selection';
import {scaleBand} from 'd3-scale';
import {nest} from 'd3-collection';
import {ascending} from 'd3-array';

import makeStack from 'components/stack';
import * as scales from 'components/scales';
import {horizontalBottom} from 'components/axis';
import {verticalLeft} from 'components/categorical-axis';
import {Variable} from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';
import configure from 'util/configure';
import Chart from 'views/chart';
import {formatValue} from 'codes';

import {Result, Data} from 'pages/opportunities-and-access/group-data';

export interface GroupChartOptions extends ViewOptions<Model> {
  variable: Variable;
  contextualVariable: ContextualVariable;
}

@configure({
  className: 'chart chart--bar chart--stacked-bar',
})
export default class GroupChart extends Chart<Model> {
  protected marginLeft = 140;
  protected marginRight = 25;
  protected marginBottom = 60;
  protected marginTop = 20;

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

  protected onVariableSelect(variable: Variable): void {
    this.variable = variable;

    this.updateAxis();
  }

  updateData(data: Result[]): void {
    this.loaded(data);
  }

  protected loaded(data: Result[]): void {
    // Reorder the data if this is SCHTYPE since we are actually pulling from both SCHTYPE and SCHTYP2.
    if (this.variable.id === 'SCHTYPE') {
      data = nest<Result>()
        .sortValues((a, b) => ascending(this.variable.categories.indexOf(a.key),
          this.variable.categories.indexOf(b.key)))
        .entries(data);
    }

    // setup and add the x axis
    const percent = scales.percent()
      .domain([0, 100]);

    const percentAxis = horizontalBottom()
      .scale(percent)
      .title(['Percent']);

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
      .size(d => percent(d.isStatDisplayable !== 0 ? d.value : 0));

    const merged = seriesUpdate.merge(seriesEnter);

    // set bar group
    const barUpdate = merged.selectAll('.bar')
      .data(d => stack(d.values))
      .classed('bar--no-data', d => d.isStatDisplayable === 0);

    barUpdate.interrupt()
      .transition()
        .attr('transform', d => `translate(${d.offset})`);

    // add bar group
    const barEnter = barUpdate.enter()
      .append('g')
        .attr('class', (_, i) => `bar bar--${i}`)
        .attr('transform', d => `translate(${d.offset})`)
        .classed('bar--no-data', d => d.isStatDisplayable === 0);

    // add bar rect svg
    barEnter.append('rect')
        .classed('bar__bar', true)
        .attr('width', d => d.size)
        .attr('height', category.bandwidth())
      .merge(barUpdate.select('.bar__bar'))
      .transition()
        .attr('height', category.bandwidth())
        .attr('width', d => d.size);

    // helper function for the text
    const setText = (d: Data, i: number): string => {
      return (d.value !== 999 || i === 0) ? formatValue(d.value, d.sig, d.errorFlag) : '';
    };

    // helper function for x value for bar text
    const xValue = (d: Data & {size: number}, i: number): number => {
      // for first text of no-data, use 5 for an offset
      return (d.isStatDisplayable === 0 && i === 0) ? 5 : d.size / 2;
    };

    // add bar text
    barEnter.append('text')
        .classed('bar__text', true)
        .attr('x', xValue)
        .attr('y', category.bandwidth() / 2)
        .attr('dy', '0.37em')
        .text(setText)
      .merge(barUpdate.select('.bar__text'))
      .transition()
        .attr('x', xValue)
        .attr('y', category.bandwidth() / 2)
        .attr('dy', '0.37em')
        .text(setText);

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

  protected updateAxis(): void {
    const {categories} = this.variable;

    const category = scaleBand()
      .domain(categories)
      .range([0, 300])
      .padding(0.2);

    const categoryAxis = verticalLeft(300)
      .categories(categories)
      .scale(category)
      .wrap(this.marginLeft - 5); // Fudge factor

    this.categoryAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(categoryAxis);
  }

  protected onVisibilityVisible(): void {
    // Update axis once chart is visible
    this.updateAxis();
  }
}
