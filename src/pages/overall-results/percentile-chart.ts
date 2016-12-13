import * as Promise from 'bluebird';
import {Model} from 'backbone';
import {symbol as makeSymbol, symbols as symbolTypes} from 'd3-shape';
import {Selection} from 'd3-selection';

import 'd3-transition';

import Chart from 'views/chart';

import * as scales from 'components/scales';

import HoverBehavior from 'behaviors/percentile-hover';
import configure from 'util/configure';

import interpolate from 'util/path-interpolate';

import makeSeries from 'components/series';
import {verticalLeft, horizontalBottom} from 'components/axis';
import {formatValue} from 'codes';

import {load, Grouped, Data} from 'pages/overall-results/percentile-data';

import context from 'models/context';

type Point<T> = T & {
  x: number;
  y: number;
};

function tagOf(data: Data[]): string {
  return data[0].stattype.toLowerCase();
}

const symbol = makeSymbol<Point<Data>>()
  .size(194)
  .type(d => {
    let index = 0;
    switch (d.stattype) {
      case 'P2':
        index = 1;
        break;

      case 'P5':
        index = 2;
        break;

      case 'P7':
        index = 3;
        break;

      case 'P9':
        index = 7;
        break;
    }

    return symbolTypes[index];
  });

@configure({
  behaviors: {
    Hover: {
      behaviorClass: HoverBehavior,
    },
  },
})
export default class PercentileChart extends Chart<Model> {
  protected marginLeft = 40;
  protected marginRight = 150;
  protected marginBottom = 30;
  protected marginTop = 30;

  protected scoreAxis: Selection<SVGGElement, {}, null, void>;
  protected yearAxis: Selection<SVGGElement, {}, null, void>;
  protected cutpoints: Selection<SVGGElement, {}, null, void>;

  protected firstRender = true;
  protected promise = Promise.resolve(void 0);

  protected renderData(): void {
    const years = ['2008R3', '2016R3'];

    this.promise = this.promise
      .then(() => load(context.subject, years))
      .then(data => this.loaded(data));

    this.promise.done();
  }

  protected addAxes(): void {
    this.scoreAxis = this.d3el.append<SVGGElement>('g');
    this.yearAxis = this.d3el.append<SVGGElement>('g');
    this.cutpoints = this.d3el.append<SVGGElement>('g');
  }

  render(): this {
    super.render();

    this.d3el.classed('chart--multi-series', true);

    if (this.firstRender) {
      this.addAxes();
      this.firstRender = false;
    }

    load(context.subject, ['2008R3', '2016R3'])
      .then(data => this.loaded(data))
      .done();

    return this;
  }

  protected addScoreAxis(scale: scales.Scale): void {
    const axis = verticalLeft()
      .scale(scale);

    this.scoreAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(axis);
  }

  protected addYearAxis(scale: scales.Scale): void {
    const years = [2008, 2016];

    const ticks = years.map(year => {
      return {
        label: year,
        value: scale(year),
      };
    });

    const axis = horizontalBottom()
      .scale(scale)
      .ticks(ticks)
      .padding(30)
      .format(n => "'" + ('' + n).substr(2, 2));

    const left = this.marginLeft,
          top = this.marginTop + this.innerHeight;

    this.yearAxis
      .attr('transform', `translate(${left}, ${top})`)
      .call(axis);
  }

  protected loaded(data: Grouped): void {
    const score = scales.score()
      .bounds([0, 300])
      .domain(data.extent)
      .reverse();

    const padding = 30;
    const year = scales.year()
      .domain([2008, 2016])
      .offset(20);

    const [lo, hi] = year.range(),
          width = (hi - lo) + padding * 2;

    const series = makeSeries<Data>()
      .x(d => year(d.targetyear))
      .y(d => score(d.targetvalue));

    this.width(width)
      .height(score.range()[0]);

    this.addScoreAxis(score);
    this.addYearAxis(year);

    const groups = [data.P1, data.P2, data.P5, data.P7, data.P9].map(series);

    const seriesUpdate = this.inner
      .selectAll('.series')
      .data(groups);

    seriesUpdate.select<SVGPathElement>('.series__line')
      .interrupt()
      .transition()
      .attrTween('d', function (d) {
        return interpolate(this.getAttribute('d'), d.line);
      });

    const pointUpdate = seriesUpdate.selectAll<SVGGElement, Point<Data>>('.series__point')
      .data(d => d.points, d => '' + d.targetyear);

    pointUpdate
      .classed('is-exiting', false)
      .interrupt()
      .transition()
      .duration(250)
      .attr('transform', ({x, y}) => `translate(${x}, ${y})`);

    pointUpdate.select('.series__point__text')
      .text(d => formatValue(d.targetvalue, d.sig, d.TargetErrorFlag));

    let pointEnter = pointUpdate.enter()
      .append('g')
      .classed('series__point', true)
      .attr('transform', ({x, y}) => `translate(${x}, ${y})`);

    pointEnter.append('text')
      .classed('series__point__text', true)
      .attr('dy', '-10px')
      .text(d => formatValue(d.targetvalue, d.sig, d.TargetErrorFlag));

    pointEnter.append('path')
      .classed('series__point__symbol', true)
      .attr('d', symbol);

    pointUpdate.exit()
      .classed('is-exiting', true)
      .transition()
      .delay(250)
      .remove();

    const seriesEnter = seriesUpdate.enter()
      .append('g')
      .attr('class', d => `series series--${tagOf(d.points)}`)
      .attr('data-tag', d => tagOf(d.points));

    seriesEnter.append('path')
      .classed('series__line', true)
      .datum(d => d.line)
      .attr('d', d => d);

    pointEnter = seriesEnter.selectAll('.series__point')
      .data(d => d.points)
      .enter()
      .append('g')
      .classed('series__point', true)
      .attr('transform', ({x, y}) => `translate(${x}, ${y})`);

    pointEnter.append('text')
      .classed('series__point__text', true)
      .attr('dy', '-10px')
      .text(d => formatValue(d.targetvalue, d.sig, d.TargetErrorFlag));

    pointEnter.append('path')
      .classed('series__point__symbol', true)
      .attr('d', symbol);
  }
}
