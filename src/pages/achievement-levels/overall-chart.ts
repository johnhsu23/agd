import {scaleBand} from 'd3-scale';
import {Selection} from 'd3-selection';

import {sortBy} from 'underscore';

import Chart from 'views/chart';

import makeBar from 'components/acl-bar';
import * as scales from 'components/scales';
import {horizontalBottom} from 'components/axis';

import context from 'models/context';
import {Data} from 'api/tuda-acrossyear';
import {yearsForGrade} from 'data/assessment-years';

const rowHeight = 30,
      duration = 500;

type Baseline = 'basic' | 'proficient';

export default class OverallChart extends Chart<Data> {
  protected marginBottom = 30;
  protected marginLeft = 50;
  protected marginRight = 50;

  protected baseline: Baseline = 'basic';

  protected firstRender = true;
  protected scoreAxis: Selection<SVGGElement, {}, null, void>;

  setBaseline(baseline: Baseline): void {
    this.baseline = baseline;
  }

  render(): this {
    super.render();

    if (this.firstRender) {
      this.scoreAxis = this.d3el.append<SVGGElement>('g');
      this.firstRender = false;
    }

    return this;
  }

  renderData(rows: Data[][]): void {
    const base = this.baseline === 'basic' ? 1 : 2;

    // First render test here: we don't know the actual size of the chart until data arrives,
    // which means that we have to do silly checks like this to discern if this is our
    // first call to renderData().
    const firstRender = !this.el.style.height;

    const x = scales.percent()
      .domain([-100, 100]);

    const [lo, hi] = x.range();
    this.width(hi - lo);

    const height = rows.length * rowHeight;
    const delay = this.height() > height ? duration / 2 : 0;
    if (firstRender) {
      this.height(height);
    } else if (this.height() !== height) {
      this.d3el
        .transition()
        .delay(delay)
        .duration(duration)
        .style('height', this.computeHeight(height) + 'px');

      this.innerHeight = height;
    }

    const y = scaleBand<number>()
      .domain(sortBy(yearsForGrade(context.grade), n => -n))
      .rangeRound([0, height])
      .padding(0.125);

    const axis = horizontalBottom()
      .format(n => '' + Math.abs(n))
      .scale(x);

    this.scoreAxis
      .call(axis);

    if (firstRender) {
      this.scoreAxis
        .attr('transform', () => {
          const x = this.marginLeft;
          const y = this.marginTop + this.height();

          return `translate(${x}, ${y})`;
        });
    } else {
      this.scoreAxis
        .transition()
        .delay(delay)
        .duration(duration)
        .attr('transform', () => {
          const x = this.marginLeft;
          const y = this.marginTop + this.height();

          return `translate(${x}, ${y})`;
        });
    }

    const bar = makeBar()
      .x(x)
      .y(y)
      .baseline(base);

    this.inner.selectAll<SVGGElement, Data[]>('.acl-row')
      .data(rows, ([row]) => '' + row.targetyear)
      .call(bar);
  }
}
