import {svg, Selection, select} from 'd3';
import {ViewOptions} from 'backbone'; 

import Chart from 'charts/chart';
import makeScale from 'charts/scale';
import makeSeries from 'charts/series';

import {load, Grouped, Data} from 'data/percentiles';

type Point<T> = T & {
  x: number;
  y: number;
};

function tagOf(data: Data[]): string {
  return data[0].stattype.toLowerCase();
}

export default class PercentileChart extends Chart<Data> {
  protected setHover(tag: string) {
    this.d3el.select('.series--' + tag)
      .classed('is-hover', true);
  }

  protected clearHover(tag: string) {
    this.d3el.select('.series--' + tag)
      .classed('is-hover', false);
  }

  protected setActive(tag: string) {
    this.d3el.selectAll('.series')
      .each(function (d) {
        const active = tag === tagOf(d.points);
        select(this)
          .classed({
            'is-active': active,
            'is-inactive': !active,
          });
      });
  }

  protected clearActive() {
    this.d3el
      .selectAll('.series')
      .classed({
        'is-active': false,
        'is-inactive': false,
      });
  }

  initialize(options?: Backbone.ViewOptions<any>) {
    super.initialize(options);

    this.on('child:hover:set', this.setHover, this);
    this.on('child:hover:clear', this.clearHover, this);
    
    this.on('child:active:set', this.setActive, this);
    this.on('child:active:clear', this.clearActive, this);
  }

  render(): this {
    super.render();

    load('science', 4, ['2009R3', '2015R3'])
      .then(data => this.loaded(data))
      .done();

    return this;
  }

  protected loaded(data: Grouped): void {
    const score = makeScale()
      .bounds([0, 500])
      .domain(data.extent)
      .interval(10)
      .intervalSize(30)
      .reverse();

    const padding = 20;
    const year = makeScale()
      .domain([2009, 2015])
      .interval(1)
      .intervalSize(20)
      .offset(20);

    const [lo, hi] = year.range(),
          width = (hi - lo) + padding * 2;

    const series = makeSeries<Data>()
      .x(d => year(d.targetyear))
      .y(d => score(d.targetvalue));

    this.width(width)
      .height(score.range()[0]);

    const groups = [data.P1, data.P2, data.P5, data.P7, data.P9].map(series);

    const sel = this.selectAll('.series')
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
        const elt = d3.select(this);

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
      .text(d => Math.round(d.targetvalue))

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
        transform: ({x, y}) => `translate(${x}, ${y})`
      })
  }
}