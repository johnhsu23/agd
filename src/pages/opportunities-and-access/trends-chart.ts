import {ViewOptions, Model} from 'backbone';
import {Selection} from 'd3-selection';
import {scaleBand} from 'd3-scale';
import {axisLeft} from 'd3-axis';

import makeStack from 'components/stack';
import * as scales from 'components/scales';
import {horizontalBottom} from 'components/axis';
import configure from 'util/configure';
import Chart from 'views/chart';
import {ContextualVariable} from 'data/contextual-variables';
import {formatValue} from 'codes';

import {Result, Data} from 'pages/opportunities-and-access/trends-data';

export interface TrendsChartOptions extends ViewOptions<Model> {
  variable: ContextualVariable;
  data: Result[];
}

@configure({
  className: 'chart chart--bar chart--stacked-bar',
})
export default class TrendsChart extends Chart<Model> {
  protected marginLeft = 140;
  protected marginRight = 25;
  protected marginBottom = 60;
  protected marginTop = 20;

  protected percentAxis: Selection<SVGGElement, {}, null, void>;
  protected yearAxis: Selection<SVGGElement, {}, null, void>;
  protected chartHeader: Selection<SVGGElement, {}, null, void>;

  protected firstRender = true;

  protected variable: ContextualVariable;
  protected data: Result[];

  constructor(options: TrendsChartOptions) {
    super(options);

    this.variable = options.variable;
    this.data = options.data;
  }

  render(): this {
    super.render();

    if (this.firstRender) {
      this.percentAxis = this.d3el.append<SVGGElement>('g');
      this.yearAxis = this.d3el.append<SVGGElement>('g');
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

    this.drawChart();

    return this;
  }

  protected drawChart(): void {
    // setup and add the x axis
    const percent = scales.percent()
      .domain([0, 100]);

    const percentAxis = horizontalBottom()
      .scale(percent)
      .title(['Percent']);

    // set chart height and width
    const chartHeight = 160,
        chartWidth = percent.size();

    this.height(chartHeight)
      .width(chartWidth);

    this.percentAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop + this.innerHeight})`)
      .call(percentAxis);

    // setup and add the y axis
    const year = scaleBand()
      .domain(this.data.map(d => d.key))
      .range([0, chartHeight])
      .padding(0.2);

    const yearAxis = axisLeft(year)
      .tickSize(0);

    this.yearAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(yearAxis);

    const seriesEnter = this.inner.selectAll('.series')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', (_, i) => `series series--${i}`)
      .attr('transform', d => `translate(0, ${year(d.key)})`);

    const stack = makeStack<Data>()
      .defined(d => d.isTargetStatDisplayable !== 0)
      .size(d => percent(d.targetvalue));

    const barEnter = seriesEnter.selectAll('.bar')
      .data(d => stack(d.values))
      .enter()
      .append('g')
      .attr('class', d => `bar bar--${d.categoryindex}`)
      .attr('transform', d => `translate(${d.offset})`);

    barEnter.append('rect')
      .classed('bar__bar', true)
      .attr('width', d => d.size)
      .attr('height', year.bandwidth());

    barEnter.append('text')
      .classed('bar__text', true)
      .attr('x', d => d.size / 2)
      .attr('y', year.bandwidth() / 2)
      .attr('dy', '0.37em')
      .text(d => formatValue(d.targetvalue, d.sig, d.TargetErrorFlag));
  }
}
