import {ViewOptions, Model} from 'backbone';
import {Selection} from 'd3-selection';
import {scaleBand, scaleOrdinal} from 'd3-scale';
import {axisLeft} from 'd3-axis';
import {stack, SeriesPoint} from 'd3-shape';
//import {range} from 'underscore';

import configure from 'util/configure';
import Chart from 'views/chart';
import {ContextualVariable} from 'data/contextual-variables';

import * as scales from 'components/scales';
import * as axis from 'components/axis';

import {load, Grouped, StackedDatum} from 'pages/student-experiences/trends-data';

export interface TrendsChartOptions extends ViewOptions<Model> {
  variable: ContextualVariable;
}

@configure({
  className: 'chart chart--bar',
})
export default class TrendsChart extends Chart<Model> {
  protected marginLeft = 50;
  protected marginRight = 25;
  protected marginBottom = 50;
  protected marginTop = 65;

  protected percentAxis: Selection<SVGGElement, {}, null, void>;
  protected yearAxis: Selection<SVGGElement, {}, null, void>;

  protected firstRender = true;

  protected variable: ContextualVariable;

  constructor(options: TrendsChartOptions) {
    super(options);

    this.variable = options.variable;
  }

  render(): this {
    super.render();

    if (this.firstRender) {
      this.percentAxis = this.d3el.append<SVGGElement>('g');
      this.yearAxis = this.d3el.append<SVGGElement>('g');

      this.firstRender = false;
    }

    load(this.variable)
      .then(data => this.loaded(data))
      .done();

    return this;
  }

  protected loaded(data: Grouped): void {
    const years = [2016, 2008];

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
      .domain(years)
      .range([0, chartHeight])
      .padding(0.5);

    const yearAxis = axisLeft(year);

    this.yearAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(yearAxis);

    // stack stuff
    // temporary colors just for testing the stacks
    const colorsArray = ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'];

    const colors = scaleOrdinal()
      .range(colorsArray.slice(0, this.variable.categories.length))
      .domain(this.variable.categories);

    const seriesData = stack().keys(this.variable.categories)(data.stackData);

    const series = this.inner.selectAll('.series')
      .data(seriesData);

    series.enter().append('g')
        .attr('class', 'series')
        .attr('fill', d => '' + colors(d.key))
      .selectAll('rect')
      // NB. Workaround for https://github.com/Microsoft/TypeScript/issues/12713
      .data(d => d as SeriesPoint<StackedDatum>[])
      .enter().append('rect')
        .attr('y', d => year(d.data['year']))
        .attr('x', d => percent(d[0]))
        .attr('height', year.bandwidth())
        .attr('width', d => percent(d[1]) - percent(d[0]));
  }

}
