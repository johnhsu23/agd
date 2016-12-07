import {ViewOptions, Model} from 'backbone';
import {Selection} from 'd3-selection';
import {scaleBand, scaleLinear} from 'd3-scale';
import {axisLeft, axisBottom} from 'd3-axis';
import {stack, SeriesPoint} from 'd3-shape';

import configure from 'util/configure';
import Chart from 'views/chart';
import {ContextualVariable} from 'data/contextual-variables';
import wrap from 'util/wrap';

import {load, Grouped, StackedDatum} from 'pages/student-experiences/trends-data';

export interface TrendsChartOptions extends ViewOptions<Model> {
  variable: ContextualVariable;
}

@configure({
  className: 'chart chart--bar chart--bar--stacked',
})
export default class TrendsChart extends Chart<Model> {
  protected marginLeft = 40;
  protected marginRight = 25;
  protected marginBottom = 30;
  protected marginTop = 50;

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
    const percent = scaleLinear()
      .domain([0, 100])
      .range([0, 500]);

    const percentAxis = axisBottom(percent);

    // set chart height and width
    const chartHeight = 160,
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
      .padding(0.2);

    const yearAxis = axisLeft(year);

    this.yearAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(yearAxis);

    // apply a white background before we do anything else
    this.selectAll('.background')
      .data([0])
      .enter().insert('rect', '.chart__inner')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', 'white');

    // now begins the stacking
    const seriesData = stack().keys(this.variable.categories)(data.stackData);

    const series = this.inner.selectAll('.series')
      .data(seriesData)
      .enter().append('g')
        .attr('class', (_, i) => `series series--${i}`);

    // add bars
    series.selectAll('rect')
      // NB. Workaround for https://github.com/Microsoft/TypeScript/issues/12713
      .data(d => d as SeriesPoint<StackedDatum>[])
      .enter().append('rect')
        .attr('y', d => year(d.data['year']))
        .attr('x', d => percent(d[0]))
        .attr('height', year.bandwidth())
        .attr('width', d => percent(d[1]) - percent(d[0]));

    // add text on top of bars
    series.selectAll('.bar--text')
      .data(d => d as SeriesPoint<StackedDatum>[])
      .enter().append('text')
        .attr('text-anchor', 'middle')
        .classed('value', true)
        .attr('x', d => (percent(d[1]) + percent(d[0])) / 2)
        .attr('y', d => year(d.data['year']) + 35)
        .text(d => Math.round(d[1] - d[0]));

    // place legend for the series
    const legend = series.append('g')
      .attr('class', 'legend')
      .attr('transform', d => {
        const datum = d[1];
        const x = (percent(datum[1]) + percent(datum[0])) / 2;
        const y = -20;
        return `translate(${x}, ${y})`;
      });

    legend.append('line')
      .attr('y1', 6)
      .attr('y2', 26);

    legend.append('text')
      .attr('text-anchor', 'middle')
      .text(d => d.key);

    // wrap text to fit within the bar
    legend.selectAll('text')
      .call(wrap, 20);
  }
}
