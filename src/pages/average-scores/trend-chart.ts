import Chart from 'views/chart';
import * as scales from 'components/scales';
import * as axes from 'components/axis';
import makeSeries from 'components/series';
import makeSymbol from 'components/symbol';
import {formatValue} from 'codes';
import makeCutpoints from 'components/cutpoint';
import * as Promise from 'bluebird';

import {Selection, extent as d3Extent} from 'd3';

import context from 'models/context';
import acls from 'data/acls';

import {Data} from 'api/tuda-acrossyear';

type Point<T> = T & {
  x: number;
  y: number;
};

const symbol = makeSymbol().size(194);

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

  initialize(): void {
    if (super.initialize) {
      super.initialize();
    }
    this.setupAxes();
  }

  protected setupAxes(): void {
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

  renderSeries([data]: Data[][]): void {
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

    const seriesUpdate = this.inner
      .selectAll('.series')
      .data([series(data)]);

    seriesUpdate.select('.series__line')
      .interrupt()
      .transition()
      .attr('d', d => d.line);

    const pointUpdate = seriesUpdate.selectAll('.series__point')
      .data<Point<Data>>(d => d.points, d => '' + d.targetyear);

    pointUpdate
      .classed('is-exiting', false)
      .interrupt()
      .transition()
      .attr('transform', ({x, y}) => `translate(${x}, ${y})`);

    pointUpdate.select('.series__point__text')
      .text(d => formatValue(d.targetvalue, d.sig, d.TargetErrorFlag));

    let pointEnter = pointUpdate.enter()
      .insert('g')
      .classed('series__point', true)
      .attr('transform', ({x, y}) => `translate(${x}, ${y})`);

    pointEnter.append('text')
      .classed('series__point__text', true)
      .attr('dy', '-10px')
      .text(d => formatValue(d.targetvalue, d.sig, d.TargetErrorFlag));

    pointEnter.append('path')
      .classed('series__point__symbol', true)
      .attr('d', symbol);

    pointUpdate
      .exit()
      .classed('is-exiting', true)
      .transition()
      .delay(250)
      .remove();

    const seriesEnter = seriesUpdate.enter()
      .append('g')
      .classed('series series--primary', true);

    seriesEnter.append('path')
      .classed('series__line', true)
      .attr('d', d => d.line);

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
