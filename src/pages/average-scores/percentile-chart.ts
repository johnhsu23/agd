import * as Promise from 'bluebird';
import {Selection} from 'd3';
import {extent as d3Extent} from 'd3';

import Chart from 'views/chart';
import {symbol as makeSymbol, types as symbolTypes} from 'components/symbol';
import makeCutpoints from 'components/cutpoint';
import * as scales from 'components/scales';

import HoverBehavior from 'behaviors/percentile-hover';
import configure from 'util/configure';

import context from 'models/grade';
import acls from 'data/acls';

import makeSeries from 'components/series';
import {verticalLeft, horizontalBottom} from 'components/axis';
import {formatValue} from 'codes';

import {load, Grouped, Data} from 'pages/average-scores/percentile-data';

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
        index = 4;
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
export default class PercentileChart extends Chart<Data> {
  protected marginLeft = 40;
  protected marginRight = 150;
  protected marginBottom = 30;
  protected marginTop = 30;

  protected scoreAxis: Selection<void>;
  protected yearAxis: Selection<void>;
  protected cutpoints: Selection<void>;

  protected firstRender = true;
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

  render(): this {
    super.render();

    this.d3el.classed('chart--multi-series', true);

    if (this.firstRender) {
      this.addAxes();
      this.firstRender = false;
    }

    load('science', 4, ['2009R3', '2015R3'])
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
    let years = [2009, 2015];
    if (context.grade === 8) {
      years = [2009, 2011, 2015];
    }

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

  protected addCutpoints(scale: scales.Scale, width: number): void {
    const cutpoints = makeCutpoints()
      .position(scale)
      .cutpoints(acls[context.grade]);

    this.cutpoints
      .attr('transform', `translate(${this.marginLeft + width}, ${this.marginTop})`)
      .call(cutpoints);
  }

  protected resizeExtent(extent: [number, number]): [number, number] {
    return d3Extent([
      ...extent,
      ...acls[context.grade].map(acl => acl.value),
    ]);
  }

  protected loaded(data: Grouped): void {
    const score = scales.score()
      .bounds([0, 300])
      .domain(this.resizeExtent(data.extent))
      .reverse();

    const padding = 30;
    const year = scales.year()
      .domain([2009, 2015])
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
    this.addCutpoints(score, width);

    const groups = [data.P1, data.P2, data.P5, data.P7, data.P9].map(series);

    const seriesUpdate = this.inner
      .selectAll('.series')
      .data(groups);

    seriesUpdate.select('.series__line')
      .transition()
      .attr('d', d => d.line);

    const pointUpdate = seriesUpdate.selectAll('.series__point')
      .data<Point<Data>>(d => d.points, d => '' + d.targetyear);

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
      .data<Point<Data>>(d => d.points)
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
