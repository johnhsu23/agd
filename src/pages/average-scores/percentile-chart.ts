import {svg, select} from 'd3';

import Chart from 'views/chart';
import * as scales from 'components/scales';

import makeSeries from 'components/series';
import {verticalLeft, horizontalBottom} from 'components/axis';

import {load, Grouped, Data} from 'pages/average-scores/percentile-data';

type Point<T> = T & {
  x: number;
  y: number;
};

function tagOf(data: Data[]): string {
  return data[0].stattype.toLowerCase();
}

export default class PercentileChart extends Chart<Data> {
  protected marginLeft = 50;
  protected marginRight = 50;
  protected marginBottom = 30;
  protected marginTop = 30;

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

  render(): this {
    super.render();

    this.d3el.classed('chart--multi-series', true);

    load('science', 4, ['2009R3', '2015R3'])
      .then(data => this.loaded(data))
      .done();

    return this;
  }

  protected addScoreAxis(scale: scales.Scale): void {
    let g = this.d3el
      .select('g.axis.axis--vertical');

    if (g.empty()) {
      g = this.d3el.append('g');
    }

    const axis = verticalLeft().scale(scale);
    g.attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(axis);
  }

  protected addYearAxis(scale: scales.Scale): void {
    const years = [2009, 2015].map(year => {
      return {
        label: year,
        value: scale(year),
      };
    });

    let g = this.d3el
      .select('g.axis.axis--horizontal-bottom');

    if (g.empty()) {
      g = this.d3el.append('g');
    }

    const axis = horizontalBottom()
      .scale(scale)
      .ticks(years)
      .padding(20)
      .format(n => "'" + ('' + n).substr(2, 2));

    const left = this.marginLeft,
          top = this.marginTop + this.innerHeight;

    g.attr('transform', `translate(${left}, ${top})`)
      .call(axis);
  }

  protected loaded(data: Grouped): void {
    const score = scales.score()
      .bounds([0, 500])
      .domain(data.extent)
      .reverse();

    const padding = 20;
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

    const groups = [data.P1, data.P2, data.P5, data.P7, data.P9].map(series);

    const sel = this.inner
      .selectAll('.series')
      .data(groups);

    const chart = this;

    const enter = sel.enter()
      .append('g')
      .attr('class', d => `series series--${tagOf(d.points)}`)
      .on('mouseover', d => {
        this.triggerMethod('parent:hover:set', tagOf(d.points));
      })
      .on('mouseout', d => {
        this.triggerMethod('parent:hover:clear', tagOf(d.points));
      })
      .on('click', function (d) {
        const elt = select(this);

        if (elt.classed('is-active')) {
          chart.triggerMethod('parent:active:clear', tagOf(d.points));
        } else {
          chart.triggerMethod('parent:active:set', tagOf(d.points));
        }
      });

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

    points.append('path')
      .classed('series__point__symbol', true)
      .attr({
        d: sym,
        transform: ({x, y}) => `translate(${x}, ${y})`,
      });
  }
}
