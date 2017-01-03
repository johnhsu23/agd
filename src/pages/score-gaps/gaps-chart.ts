import {Model} from 'backbone';
import {Selection} from 'd3-selection';
import {symbolCircle as gapCircle} from 'd3-shape';

import 'd3-transition';

import configure from 'util/configure';
import Chart from 'views/chart';
import * as api from 'pages/score-gaps/gaps-data';
import interpolate from 'util/path-interpolate';
import {formatValue, formatGap} from 'codes';

import * as scales from 'components/scales';
import * as axis from 'components/axis';
import {symbol as makeSymbol, types as symbolTypes, gapDiamond} from 'components/symbol';
import {gap as makeGap, GapPoint, PointInfo} from 'components/gap';

type Point = {
  errorFlag: number;
  category: number;
  sig: string;
};

const symbol = makeSymbol<GapPoint<Point, api.GapData>>()
  .size(194)
  .type(d => symbolTypes[d.category - 1]);

const gapSymbol = makeSymbol<api.GapData>()
  .size(1000)
  .type(d => {
    if (d.sig === '<' || d.sig === '>') {
      return gapCircle;
    } else {
      return gapDiamond;
    }
  });

@configure({
  className: 'chart chart--gaps',
})
export default class GapsChart extends Chart<Model> {
  protected marginLeft = 40;
  protected marginRight = 40;
  protected marginBottom = 30;
  protected marginTop = 50;

  protected scoreAxis: Selection<SVGGElement, {}, null, void>;
  protected yearAxis: Selection<SVGGElement, {}, null, void>;
  protected gap: Selection<SVGGElement, {}, null, void>;
  protected markers: Selection<SVGGElement, {}, null, void>;

  protected extent: [number, number] = [Infinity, -Infinity];

  protected firstRender = true;

  render(): this {
    super.render();

    if (this.firstRender) {
      this.scoreAxis = this.d3el.append<SVGGElement>('g');
      this.yearAxis = this.d3el.append<SVGGElement>('g');
      this.gap = this.inner.append<SVGGElement>('g');
      this.markers = this.inner.append<SVGGElement>('g');

      this.firstRender = false;
    }

    return this;
  }

  protected resizeExtent(data: api.GapData[]): void {
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

  renderData(result: api.Result): void {
    const data = result.gaps,
          trendSig = result.trend,
          focalTrend = result.focal,
          targetTrend = result.target;

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

    const text = ['Assessment Year'],
      lineHeight = -1.1,
      textLength = text.length - 1;

    // Select all child <tspan> elements of the axis title's <text> element
    const tspans = this.yearAxis.append('text')
      .classed('axis__title', true) // add CSS class
      .selectAll('tspan')
      .data(text);

    tspans.enter()
      .append('tspan')
      .text(d => d)
      .attr('x', this.marginLeft * 3)
      .attr('y', this.marginTop / 2)
      .attr('dy', (_, index) => (textLength - index) * lineHeight + 'em');

    const scoreAxis = axis.verticalLeft()
      .scale(score);

    this.scoreAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(scoreAxis);

    const textY = ['Scale', 'Score'],
      textLengthY = textY.length - 1;

    // Select all child <tspan> elements of the axis title's <text> element
    const tspansY = this.scoreAxis.append('text')
      .classed('axis__title', true) // add CSS class
      .selectAll('tspan')
      .data(textY);

    tspansY.enter()
      .append('tspan')
      .text(d => d)
      .attr('x', this.marginLeft * -1)
      .attr('y', this.marginTop / -3)
      .attr('dy', (_, index) => (textLengthY - index) * lineHeight + 'em');

    function focalData(row: api.GapData): PointInfo<Point> {
      // We're only loading two data points for trend sigs: the focal category's data and the target category's.
      // As a result, we can just directly index the loaded trend data without using d3.nest.
      const sig = row.year === 2016 ? '' : focalTrend.sig;

      return {
        sig,
        category: row.categoryindex,
        errorFlag: row.focalErrorFlag,
        value: row.focalValue,
        y: score(row.focalValue),
        defined: row.isFocalStatDisplayable !== 0,
      };
    }

    function targetData(row: api.GapData): PointInfo<Point> {
      // We're only loading two data points for trend sigs: the focal category's data and the target category's.
      // As a result, we can just directly index the loaded trend data without using d3.nest.
      const sig = row.year === 2016 ? '' : targetTrend.sig;

      return {
        sig,
        category: row.categorybindex,
        errorFlag: row.targetErrorFlag,
        value: row.targetValue,
        y: score(row.targetValue),
        defined: row.isTargetStatDisplayable !== 0,
      };
    }

    const gapData = makeGap<Point, api.GapData>()
      .x(d => year(d.year))
      .focal(focalData)
      .target(targetData)
      .defined(row => row.isSigDisplayable !== 0)
      (data);

    // Gap surface

    const gapUpdate = this.gap.selectAll('path.gap')
      .data([gapData.area]);

    gapUpdate.interrupt()
      .transition()
      .attr('d', d => d);

    gapUpdate.enter()
      .append('path')
      .classed('gap', true)
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

    const pointUpdate = seriesMerged.selectAll<SVGGElement, GapPoint<Point, api.GapData>>('.series__point')
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
      .text(d => formatValue(d.value, d.sig, d.errorFlag));

    pointEnter.append('path')
      .classed('series__point__symbol', true)
      .merge(pointUpdate.select('.series__point__symbol'))
      .attr('d', symbol);

    const markerUpdate = this.markers.selectAll<SVGGElement, api.GapData>('.gap-marker')
      .data(gapData.markers, d => '' + d.year);

    markerUpdate.exit()
      .classed('is-exiting', true)
      .transition()
      .delay(250)
      .remove();

    const markerEnter = markerUpdate.enter()
      .append('g')
      .classed('gap-marker', true);

    markerEnter.merge(markerUpdate)
      .classed('gap-marker--significant', d => d.sig === '<' || d.sig === '>')
      .classed('gap-marker--not-significant', d => d.sig !== '<' && d.sig !== '>')
      .attr('transform', d => `translate(${year(d.year)}, ${this.innerHeight - 25})`);

    markerEnter.append('path')
      .classed('gap-marker__marker', true)
      .merge(markerUpdate.select('.gap-marker__marker'))
      .attr('d', gapSymbol);

    markerEnter.append('text')
      .classed('gap-marker__text', true)
      .attr('y', '6px')
      .merge(markerUpdate.select('.gap-marker__text'))
      .text(d => formatGap(d.gap, d.year === 2016 ? '' : trendSig.sig));
  }
}
