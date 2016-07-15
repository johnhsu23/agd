import Chart from 'views/chart';
import * as scales from 'components/scales';
import * as axes from 'components/axis';
import makeSeries from 'components/series';

import {Selection, extent, svg} from 'd3';

import {Data} from 'api/tuda-acrossyear';
import load from 'pages/average-scores/trend-data';

type Point<T> = T & {
  x: number;
  y: number;
};

export default class TrendChart extends Chart<Data> {
  protected marginLeft = 50;
  protected marginRight = 50;
  protected marginBottom = 30;
  protected marginTop = 30;

  protected firstRender = true;
  protected scoreAxis: Selection<void>;
  protected yearAxis: Selection<void>;

  render(): this {
    super.render();

    if (this.firstRender) {
      this.addAxes();
      this.firstRender = false;
    }

    load('science', 4, ['2009R3', '2015R3'])
      .then(data => this.loaded(data))
      .done();

    return this;
  }

  protected addAxes(): void {
    this.scoreAxis = this.d3el.append('g');
    this.yearAxis = this.d3el.append('g');
  }

  protected addScoreAxis(scale: scales.Scale): void {
    const axis = axes.verticalLeft()
      .scale(scale);

    this.scoreAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(axis);
  }

  protected addYearAxis(scale: scales.Scale): void {
    const years = [2009, 2015].map(year => {
      return {
        label: year,
        value: scale(year),
      };
    });

    const axis = axes.horizontalBottom()
      .scale(scale)
      .ticks(years)
      .padding(20)
      .format(n => "'" + ('' + n).substr(2, 2));

    const left = this.marginLeft,
          top = this.marginTop + this.innerHeight;

    this.yearAxis
      .attr('transform', `translate(${left}, ${top})`)
      .call(axis);
  }

  protected loaded(data: Data[]): void {
    console.log('loaded', data);

    const score = scales.score()
      .bounds([0, 300])
      .domain(extent(data, row => row.targetvalue))
      .reverse();

    const padding = 20;
    const year = scales.year()
      .domain([2009, 2015])
      .offset(padding);

    const [lo, hi] = year.range(),
          width = (hi - lo) + padding * 2;

    this.width(width)
      .height(score.range()[0]);

    this.addScoreAxis(score);
    this.addYearAxis(year);

    const series = makeSeries<Data>()
      .x(row => year(row.targetyear))
      .y(row => score(row.targetvalue));

    const sel = this.inner
      .selectAll('.series')
      .data([series(data)]);

    console.log(series(data));

    const enter = sel.enter()
      .append('g')
      .classed('series series--primary', true);

    enter.append('path')
      .classed('series__line', true)
      .datum(d => d.line)
      .attr('d', d => d);

    const points = enter.selectAll('.series__point')
      .data<Point<Data>>(d => d.points)
      .enter()
      .append('g')
      .classed('series__point', true);

    points.append('text')
      .classed('series__point__text', true)
      .attr({
        x: d => d.x,
        y: d => d.y,
        dy: '-10px',
      })
      .text(d => Math.round(d.targetvalue));

    points.append('path')
      .classed('series__point__symbol', true)
      .attr({
        d: svg.symbol<Point<Data>>().size(192),
        transform: ({x, y}) => `translate(${x}, ${y})`,
      });
  }
}
