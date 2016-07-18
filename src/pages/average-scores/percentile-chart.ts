import * as $ from 'jquery';
import * as Promise from 'bluebird';
import {svg, select, Selection} from 'd3';
import {EventsHash} from 'backbone';

import Chart from 'views/chart';
import makeCutpoints from 'components/cutpoint';
import * as scales from 'components/scales';

import grade from 'models/grade';

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

    this.listenTo(grade, 'change:grade', this.renderData);

    return this;
  }

  undelegateEvents(): this {
    this.stopListening(grade, 'change:grade');

    return super.undelegateEvents();
  }

  events(): EventsHash {
    return {
      'mouseover .series': 'seriesMouseover',
      'mouseout .series': 'seriesMouseout',
      'click .series': 'seriesClick',
    };
  }

  protected renderData(): void {
    let years = ['2009R3', '2015R3'];
    if (grade.grade === 8) {
      years = ['2009R3', '2011R3', '2015R3'];
    }

    this.promise = this.promise
      .then(() => load('science', grade.grade, years))
      .then(data => this.loaded(data));

    this.promise.done();
  }

  protected seriesMouseover(event: JQueryMouseEventObject): void {
    const {points} = $(event.currentTarget).prop('__data__');

    this.triggerMethod('parent:hover:set', tagOf(points));
  }

  protected seriesMouseout(event: JQueryMouseEventObject): void {
    const {points} = $(event.currentTarget).prop('__data__');

    this.triggerMethod('parent:hover:clear', tagOf(points));
  }

  protected seriesClick(event: JQueryMouseEventObject): void {
    const $series = $(event.currentTarget),
          {points} = $series.prop('__data__'),
          tag = tagOf(points);

    if ($series.hasClass('is-active')) {
      this.triggerMethod('parent:active:clear', tag);
    } else {
      this.triggerMethod('parent:active:set', tag);
    }
  }

  protected onChildHoverSet(tag: string): void {
    this.inner
      .select('.series--' + tag)
      .classed('is-hover', true);
  }

  protected onChildHoverClear(tag: string): void {
    this.inner
      .select('.series--' + tag)
      .classed('is-hover', false);
  }

  protected onChildActiveSet(tag: string): void {
    this.inner
      .selectAll('.series')
      .each(function (d) {
        const active = tag === tagOf(d.points);
        select(this)
          .classed({
            'is-active': active,
            'is-inactive': !active,
          });
      });
  }

  protected onChildActiveClear(): void {
    this.inner
      .selectAll('.series')
      .classed({
        'is-active': false,
        'is-inactive': false,
      });
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
    const years = [2009, 2015].map(year => {
      return {
        label: year,
        value: scale(year),
      };
    });

    const axis = horizontalBottom()
      .scale(scale)
      .ticks(years)
      .padding(30)
      .format(n => "'" + ('' + n).substr(2, 2));

    const left = this.marginLeft,
          top = this.marginTop + this.innerHeight;

    this.yearAxis
      .attr('transform', `translate(${left}, ${top})`)
      .call(axis);
  }

  protected addCutpoints(scale: scales.Scale, width: number): void {
    const acls = [
      {
        label: 'Basic',
        value: 131,
      },
      {
        label: 'Proficient',
        value: 167,
      },
      {
        label: 'Advanced',
        value: 224,
      },
    ];

    const cutpoints = makeCutpoints()
      .position(scale)
      .cutpoints(acls);

    this.cutpoints
      .attr('transform', `translate(${this.marginLeft + width}, ${this.marginTop})`)
      .call(cutpoints);
  }

  protected resizeExtent(extent: [number, number]): [number, number] {
    let [lo, hi] = extent;

    lo = Math.min(lo, 131);
    hi = Math.max(hi, 224);

    return [lo, hi];
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

    const sym = svg.symbol<Point<Data>>()
      .size(192)
      .type(d => {
        switch (d.stattype) {
          case 'P1':
            return svg.symbolTypes[0];

          case 'P2':
            return svg.symbolTypes[1];

          case 'P5':
            return svg.symbolTypes[2];

          case 'P7':
            return svg.symbolTypes[3];

          case 'P9':
            return svg.symbolTypes[4];

          default:
            throw new Error(`Unknown stattype ${d.stattype}`);
        }
      });

    const sel = this.inner
      .selectAll('.series')
      .data(groups);

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
        d: sym,
        transform: ({x, y}) => `translate(${x}, ${y})`,
      });

    update.exit()
      .remove();

    const enter = sel.enter()
      .append('g')
      .attr('class', d => `series series--${tagOf(d.points)}`);

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
        d: sym,
        transform: ({x, y}) => `translate(${x}, ${y})`,
      });
  }
}
