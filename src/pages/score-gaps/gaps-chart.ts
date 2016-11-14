import * as Promise from 'bluebird';
import {Selection} from 'd3-selection';

import 'd3-transition';

import configure from 'util/configure';
import {Variable, SDRACE} from 'data/variables';
import Chart from 'views/chart';
import load from 'pages/score-gaps/gaps-data';
import {Data} from 'api/tuda-gap';
import interpolate from 'util/path-interpolate';
import {formatValue} from 'codes';

import * as scales from 'components/scales';
import * as axis from 'components/axis';
import {symbol as makeSymbol, types as symbolTypes} from 'components/symbol';
import {gap as makeGap, GapPoint, PointInfo} from 'components/gap';

type Point = {
  errorFlag: number;
  category: number;
};

const symbol = makeSymbol<GapPoint<Point, Data>>()
  .size(194)
  .type(d => symbolTypes[d.category - 1]);

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
      this.scoreAxis = this.d3el.append<SVGGElement>('g');
      this.yearAxis = this.d3el.append<SVGGElement>('g');
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

  protected resizeExtent(data: Data[]): void {
    let lo = Infinity,
        hi = -Infinity;

    for (const row of data) {
      if (row.isFocalStatDisplayable) {
        lo = Math.min(lo, row.focalValue);
        hi = Math.max(hi, row.focalValue);
      }

      if (row.isTargetStatDisplayable) {
        lo = Math.min(lo, row.targetValue);
        hi = Math.max(hi, row.targetValue);
      }
    }

    const lower = isFinite(this.extent[0]) ? this.extent[0] : lo,
          diff = lo - lower;

    // This resize logic is slightly overcomplicated, but here's the rationale:
    // * `diff` represents the difference between the current lower bound (this.extent[0])
    //   and the newly-computed bound (`lo`).
    // * If this value is negative, it implies that the new lower bound *may* extend past the area we'd like to reserve
    //   for the gap symbols themselves.
    //
    // We have to check if this difference is within the reserved 20 point difference. If it is, then we need to
    // artificially extend the lower bound.
    if (diff <= 0) {
      // If it's between 0 and 10 points, we need to add 20 points' worth of space to the bottom.
      if (diff > -10) {
        lo -= 20;
      } else if (diff > -20) {
        // But if it's between 10 and 20 points, we only need to add 10 points' worth of space.
        lo -= 10;
      }
    }

    this.extent = [
      Math.min(lo, this.extent[0]),
      Math.max(hi, this.extent[1]),
    ];
  }

  protected loaded(data: Data[]): void {
    this.resizeExtent(data);

    const year = scales.year()
      .domain([2007, 2017]);

    const score = scales.score()
      .domain(this.extent)
      .bounds([0, 300])
      .reverse();

    this.height(score.range()[0])
      .width(year.range()[1]);

    const yearAxis = axis.horizontalBottom()
      .scale(year)
      .format(n => "'" + ('' + n).substr(2))
      .ticks([
        { value: year(2008), label: 2008 },
        { value: year(2016), label: 2016 },
      ]);

    this.yearAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop + this.innerHeight})`)
      .call(yearAxis);

    const scoreAxis = axis.verticalLeft()
      .scale(score);

    this.scoreAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(scoreAxis);

    function focalData(row: Data): PointInfo<Point> {
      return {
        category: row.categoryindex,
        errorFlag: row.focalErrorFlag,
        value: row.focalValue,
        position: score(row.focalValue),
        defined: row.isFocalStatDisplayable !== 0,
      };
    }

    function targetData(row: Data): PointInfo<Point> {
      return {
        category: row.categorybindex,
        errorFlag: row.targetErrorFlag,
        value: row.targetValue,
        position: score(row.targetValue),
        defined: row.isTargetStatDisplayable !== 0,
      };
    }

    const gapData = makeGap<Point, Data>()
      .location(d => year(d.year))
      .focal(focalData)
      .target(targetData)
      (data);

    // Gap surface

    const gapUpdate = this.gap.selectAll('path.chart--gaps__gap')
      .data([gapData.area]);

    gapUpdate.interrupt()
      .transition()
      .attr('d', d => d);

    gapUpdate.enter()
      .append('path')
      .classed('chart--gaps__gap', true)
      .attr('d', d => d);

    // Draw focal & target series

    const seriesUpdate = this.inner.selectAll('.series')
      .data(gapData.series);

    seriesUpdate.select<SVGPathElement>('.series__line')
      .classed('is-exiting', d => d.points.some(d => !d.defined))
      .interrupt()
      .transition()
      .attrTween('d', function (d) {
        return interpolate(this.getAttribute('d'), d.line);
      });

    const seriesEnter = seriesUpdate.enter()
      .append('g')
      .attr('class', d => `series series--${d.type}`);

    seriesEnter.append('path')
      .classed('series__line', true)
      .attr('d', d => d.line);

    seriesUpdate.select<SVGPathElement>('.series__line')
      .interrupt()
      .transition()
      .attrTween('d', function (d) {
        return interpolate(this.getAttribute('d'), d.line);
      });

    const seriesMerged = seriesEnter.merge(seriesUpdate);

    seriesMerged.select('.series__line')
      .attr('d', d => d.line);

    const pointUpdate = seriesMerged.selectAll<SVGGElement, GapPoint<Point, Data>>('.series__point')
      .data(d => d.points.filter(d => d.defined), d => '' + d.data.year);

    pointUpdate.exit()
      .classed('is-exiting', true)
      .transition()
      .delay(500)
      .remove();

    pointUpdate.interrupt()
      .transition()
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    const pointEnter = pointUpdate.enter()
      .append('g')
      .classed('series__point', true)
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    pointEnter.append('text')
      .classed('series__point__text', true)
      .merge(pointUpdate.select('.series__point__text'))
      .attr('y', d => d.above ? '-15px' : '28px')
      .text(d => formatValue(d.value, '', d.errorFlag));

    pointEnter.append('path')
      .classed('series__point__symbol', true)
      .merge(pointUpdate.select('.series__point__symbol'))
      .attr('d', symbol);
  }
}
