import Chart from 'views/chart';
import * as scales from 'components/scales';
import * as axes from 'components/axis';
import makeSeries from 'components/series';
import {formatValue} from 'codes';
import makeCutpoints from 'components/cutpoint';
import * as Promise from 'bluebird';

import {Selection, extent as d3Extent, svg} from 'd3';

import context from 'models/grade';
import acls from 'data/acls';

import {Data} from 'api/tuda-acrossyear';
import load from 'pages/average-scores/trend-data';

type Point<T> = T & {
  x: number;
  y: number;
};

export default class TrendChart extends Chart<Data> {
  protected marginLeft = 40;
  protected marginRight = 150;
  protected marginBottom = 30;
  protected marginTop = 30;

  protected firstRender = true;
  protected scoreAxis: Selection<void>;
  protected yearAxis: Selection<void>;
  protected cutpoints: Selection<void>;

  protected promise = Promise.resolve(void 0);

  delegateEvents(): this {
    super.delegateEvents();

    this.listenTo(context, 'change:grade', this.renderData);

    return this;
  }

  undelegateEvents(): this {
    this.stopListening(context, 'change:grade');

    return super.undelegateEvents();
  }

  render(): this {
    super.render();

    if (this.firstRender) {
      this.addAxes();
      this.firstRender = false;
    }

    this.renderData();

    return this;
  }

  protected renderData(): void {
    let years = ['2009R3', '2015R3'];
    if (context.grade === 8) {
      years = ['2009R3', '2011R3', '2015R3'];
    }

    this.promise = this.promise
      .then(() => load('science', context.grade, years))
      .then(data => this.loaded(data));

    this.promise.done();
  }

  protected addAxes(): void {
    this.scoreAxis = this.d3el.append('g');
    this.yearAxis = this.d3el.append('g');
    this.cutpoints = this.d3el.append('g');
  }

  protected addScoreAxis(scale: scales.Scale): void {
    const axis = axes.verticalLeft()
      .scale(scale);

    this.scoreAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(axis);
  }

  protected addYearAxis(scale: scales.Scale, years: number[]): void {
    const labeled = years.map(year => {
      return {
        label: year,
        value: scale(year),
      };
    });

    const axis = axes.horizontalBottom()
      .scale(scale)
      .ticks(labeled)
      .padding(30)
      .format(n => "'" + ('' + n).substr(2, 2));

    const left = this.marginLeft,
          top = this.marginTop + this.innerHeight;

    this.yearAxis
      .attr('transform', `translate(${left}, ${top})`)
      .call(axis);
  }

  protected addCutpoints(scale: scales.Scale, width: number): void {
    const cutpoints = makeCutpoints()
      .position(scale)
      .cutpoints(acls[context.grade]);

    this.cutpoints
      .attr('transform', `translate(${width + this.marginLeft}, ${this.marginTop})`)
      .call(cutpoints);
  }

  protected loaded(data: Data[]): void {
    const cutpoints = acls[context.grade].map(acl => acl.value);

    let extent = d3Extent(data, row => row.targetvalue);
    extent = d3Extent([...extent, ...cutpoints]);

    const score = scales.score()
      .bounds([0, 300])
      .domain(extent)
      .reverse();

    const padding = 30;
    const year = scales.year()
      .domain(d3.extent(data, row => row.targetyear))
      .offset(padding);

    const [lo, hi] = year.range(),
          width = (hi - lo) + padding * 2;

    this.width(width)
      .height(score.range()[0]);

    this.addCutpoints(score, width);
    this.addScoreAxis(score);
    this.addYearAxis(year, data.map(d => d.targetyear));

    const series = makeSeries<Data>()
      .x(row => year(row.targetyear))
      .y(row => score(row.targetvalue));

    const sel = this.inner
      .selectAll('.series')
      .data([series(data)]);

    sel.select('.series__line')
      .datum(d => d.line)
      .attr('d', d => d);

    const update = sel.selectAll('.series__point')
      .data<Point<Data>>(d => d.points, d => '' + d.targetyear);

    update.select('.series__point__symbol')
      .attr('transform', ({x, y}) => `translate(${x}, ${y})`);

    update.select('.series__point__text')
      .attr({
        x: d => d.x,
        y: d => d.y,
      })
      .text(d => formatValue(d.targetvalue, d.sig, d.TargetErrorFlag));

    let points = update.enter()
      .append('g')
      .classed('series__point', true);

    points.append('text')
      .classed('series__point__text', true)
      .attr({
        x: d => d.x,
        y: d => d.y,
        dy: '-10px',
      })
      .text(d => formatValue(d.targetvalue, d.sig, d.TargetErrorFlag));

    points.append('path')
      .classed('series__point__symbol', true)
      .attr({
        d: svg.symbol<Point<Data>>().size(192),
        transform: ({x, y}) => `translate(${x}, ${y})`,
      });

    update.exit()
      .remove();

    const enter = sel.enter()
      .append('g')
      .classed('series series--primary', true);

    enter.append('path')
      .classed('series__line', true)
      .datum(d => d.line)
      .attr('d', d => d);

    points = enter.selectAll('.series__point')
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
      .text(d => formatValue(d.targetvalue, d.sig, d.TargetErrorFlag));

    points.append('path')
      .classed('series__point__symbol', true)
      .attr({
        d: svg.symbol<Point<Data>>().size(192),
        transform: ({x, y}) => `translate(${x}, ${y})`,
      });
  }
}
