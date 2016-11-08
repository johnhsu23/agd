import * as Promise from 'bluebird';
import {Selection} from 'd3-selection';
import {extent} from 'd3-array';
import {area as makeArea} from 'd3-shape';

import 'd3-transition';

import configure from 'util/configure';
import {Variable, SDRACE} from 'data/variables';
import Chart from 'views/chart';
import load from 'pages/score-gaps/gaps-data';
import {Data} from 'api/tuda-gap';
import interpolate from 'util/path-interpolate';
import {formatValue} from 'codes';

import * as scales from 'components/scales';
import makeSeries from 'components/series';
import {symbol as makeSymbol, types as symbolTypes} from 'components/symbol';

const focalSymbol = makeSymbol<Data>()
  .size(194)
  .type(d => symbolTypes[d.categoryindex - 1]);

const targetSymbol = makeSymbol<Data>()
  .size(194)
  .type(d => symbolTypes[d.categorybindex - 1]);

type Point<T> = T & {
  x: number;
  y: number;
};

@configure({
  className: 'chart chart--gaps',
})
export default class GapsChart extends Chart<any> {
  protected marginLeft = 40;
  protected marginRight = 40;
  protected marginBottom = 30;
  protected marginTop = 30;

  protected scoreAxis: Selection<SVGGElement, {}, null, void>;
  protected yearAxis: Selection<SVGGElement, {}, null, void>;
  protected gap: Selection<SVGGElement, {}, null, void>;

  protected variable: Variable = SDRACE;
  protected focal: number = 0;
  protected target: number = 1;

  protected extent: [number, number] = [Infinity, -Infinity];

  protected firstRender = true;
  protected promise = Promise.resolve(void 0);

  delegateEvents(): this {
    super.delegateEvents();

    this.on('gap:select', this.onGapSelect);

    return this;
  }

  render(): this {
    super.render();

    if (this.firstRender) {
      this.gap = this.inner.append<SVGGElement>('g');

      this.firstRender = false;
    }

    this.renderData();

    return this;
  }

  protected onGapSelect(variable: Variable, focal: number, target: number): void {
    this.variable = variable;
    this.focal = focal;
    this.target = target;

    this.renderData();
  }

  protected renderData(): void {
    const id = this.variable.id;

    this.promise = this.promise
      .then(() => load('science', id, this.focal, this.target))
      .then(data => this.loaded(data));

    this.promise
      .done();
  }

  protected loaded(data: Data[]): void {
    const focalExtent = extent(data, d => d.focalValue),
          targetExtent = extent(data, d => d.targetValue);

    const lo = Math.min(this.extent[0], focalExtent[0], targetExtent[0]),
          hi = Math.max(this.extent[1], focalExtent[1], targetExtent[1]);

    this.extent = [lo, hi];

    const x = scales.year()
      .domain([2009, 2015])
      .offset(30);

    const y = scales.score()
      .domain(this.extent)
      .bounds([0, 300]);

    this.height(y.range()[1])
      .width(x.range()[1]);

    // Gap surface

    const area = makeArea<Data>()
      .x(d => x(d.year))
      .y0(d => y(Math.max(d.focalValue, d.targetValue)))
      .y1(d => y(Math.min(d.focalValue, d.targetValue)))
      .defined(d => !!(d.isFocalStatDisplayable && d.isTargetStatDisplayable));

    const gapUpdate = this.gap.selectAll('path.chart--gaps__gap')
      .data([data]);

    gapUpdate.enter()
      .append('path')
      .classed('chart--gaps__gap', true)
      .merge(gapUpdate)
      .attr('d', area);

    // Focal series

    const focalSeries = makeSeries<Data>()
      .x(d => x(d.year))
      .y(d => y(d.focalValue))
      .defined(d => d.isFocalStatDisplayable !== 0);

    const focalUpdate = this.inner.selectAll('.series.series--focal')
      .data([focalSeries(data)]);

    focalUpdate.select<SVGPathElement>('.series__line')
      .interrupt()
      .transition()
      .attrTween('d', function (d) {
        return interpolate(this.getAttribute('d'), d.line);
      });

    let focalPointUpdate = focalUpdate.selectAll<SVGGElement, Point<Data>>('.series__point')
      .data(d => d.points, d => '' + d.year);

    focalPointUpdate.classed('is-exiting', false)
      .interrupt()
      .transition()
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    focalPointUpdate.select('.series__point__text')
      .text(d => formatValue(d.focalValue, '', d.focalErrorFlag));

    focalPointUpdate.select('.series__point__symbol')
      .attr('d', focalSymbol);

    const focalEnter = focalUpdate.enter()
      .append('g')
      .classed('series series--focal', true);

    focalEnter.append<SVGPathElement>('path')
      .classed('series__line', true)
      .attr('d', d => d.line);

    focalPointUpdate = focalEnter.selectAll<SVGGElement, Point<Data>>('.series__point')
      .data(d => d.points, d => '' + d.year);

    const focalPointEnter = focalPointUpdate.enter()
      .append('g')
      .classed('series__point', true)
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    focalPointEnter.append('text')
      .classed('series__point__text', true)
      .attr('y', '-12px')
      .text(d => formatValue(d.focalValue, '', d.focalErrorFlag));

    focalPointEnter.append('path')
      .classed('series__point__symbol', true)
      .attr('d', focalSymbol);

    // Target series

    const targetSeries = makeSeries<Data>()
      .x(d => x(d.year))
      .y(d => y(d.targetValue))
      .defined(d => d.isFocalStatDisplayable !== 0);

    const targetUpdate = this.inner.selectAll('.series.series--target')
      .data([targetSeries(data)]);

    targetUpdate.select<SVGPathElement>('.series__line')
      .interrupt()
      .transition()
      .attrTween('d', function (d) {
        return interpolate(this.getAttribute('d'), d.line);
      });

    const targetPointUpdate = targetUpdate.selectAll<SVGGElement, Point<Data>>('.series__point')
      .data(d => d.points, d => '' + d.year);

    targetPointUpdate.interrupt()
      .transition()
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    targetPointUpdate.select('.series__point__text')
      .text(d => formatValue(d.targetValue, '', d.targetErrorFlag));

    targetPointUpdate.select('.series__point__symbol')
      .attr('d', targetSymbol);

    const targetEnter = targetUpdate.enter()
      .append('g')
      .classed('series series--target', true);

    targetEnter.append<SVGPathElement>('path')
      .classed('series__line', true)
      .attr('d', d => d.line);

    const targetPointEnter = targetEnter.selectAll<SVGGElement, Point<Data>>('.series__point')
      .data(d => d.points, d => '' + d.year)
      .enter()
      .append('g')
      .classed('series__point', true)
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    targetPointEnter.append('text')
      .classed('series__point__text', true)
      .attr('y', '24px')
      .text(d => formatValue(d.targetValue, '', d.targetErrorFlag));

    targetPointEnter.append('path')
      .classed('series__point__symbol', true)
      .attr('d', targetSymbol);
  }
}
