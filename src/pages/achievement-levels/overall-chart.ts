import * as d3 from 'd3';
import {sortBy} from 'underscore';

import Chart from 'views/chart';

import makeStack from 'components/stack';
import * as scales from 'components/scales';
import {horizontalBottom} from 'components/axis';

import * as codes from 'codes';
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
  protected scoreAxis: d3.Selection<void>;

  setBaseline(baseline: Baseline): void {
    this.baseline = baseline;
  }

  render(): this {
    super.render();

    if (this.firstRender) {
      this.scoreAxis = this.d3el.append('g');
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

    const y = d3.scale.ordinal<number, number>()
      .domain(sortBy(yearsForGrade(context.grade), n => -n))
      .rangeRoundBands([0, height], 0.125);

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

    const stack = makeStack<Data>()
      .defined(d => !(codes.isNotApplicable(d.TargetErrorFlag) || codes.isNotAvailable(d.TargetErrorFlag)))
      .size(d => x(d.targetvalue) - x(0));

    const rowUpdate = this.inner.selectAll('.acl-row')
      .data(rows.map(stack), ([row]) => '' + row.targetyear);

    rowUpdate
      .transition()
      .duration(duration)
      .attr('transform', ([row]) => `translate(0, ${y(row.targetyear)})`);

    rowUpdate.each(function (rows) {
      const sel = d3.select(this),
            ba = rows[base];

      const baseline = x(0) - ba.offset;

      const itemUpdate = sel.selectAll('.acl-row__item')
        .data(rows);

      const itemTx = itemUpdate
        .transition()
        .duration(duration)
        .attr('transform', d => `translate(${d.offset + baseline})`);

      itemUpdate.select('.acl-row__text')
        .text(d => codes.formatValue(d.targetvalue, d.sig, d.TargetErrorFlag))
        .classed('is-shifted-right', d => d.size < 5);

      itemTx.select('.acl-row__text')
        .attr('x', d => {
          if (d.size > 5) {
            return d.size / 2;
          }

          return d.size + 2;
        });

      itemTx.select('.acl-row__bar')
        .attr('width', d => d.size);
    });

    const rowEnter = rowUpdate.enter()
      .insert('g')
      .classed('acl-row', true)
      .attr('transform', ([row]) => `translate(0, ${y(row.targetyear)})`);

    rowEnter.each(function (rows) {
      const sel = d3.select(this),
            ba = rows[base];

      sel.append('text')
        .classed('acl-row__label', true)
        .text(ba.targetyear)
        .attr('x', -10)
        .attr('y', '1.1em');

      const baseline = x(0) - ba.offset;

      const enter = sel.selectAll('.acl-row__item')
        .data(rows, d => d.stattype)
        .enter()
        .append('g')
        .classed('acl-row__item', true)
        .attr('transform', `translate(${x(0)})`);

      enter
        .transition()
        .duration(duration)
        .attr('transform', d => `translate(${d.offset + baseline})`);

      enter
        .append('rect')
        .attr('class', d => `acl-row__bar acl-row__bar--${d.stattype.toLowerCase()}`)
        .attr('width', 0)
        .attr('height', y.rangeBand())
        .transition()
        .duration(duration)
        .attr('width', d => d.size);

      enter
        .append('text')
        .classed('acl-row__text', true)
        .classed('is-shifted-right', d => d.size < 5)
        .attr('x', 0)
        .attr('y', '1.1em')
        .text(d => codes.formatValue(d.targetvalue, d.sig, d.TargetErrorFlag))
        .transition()
        .duration(duration)
        .attr('x', d => {
          if (d.size > 5) {
            return d.size / 2;
          }

          return d.size + 2;
        });
    });

    const rowExit = rowUpdate.exit();

    rowExit.select('.acl-row__label')
      .classed('is-exiting', true)
      .transition()
      .delay(500)
      .remove();

    const rowTx = rowExit
      .transition()
      .duration(500)
      .remove();

    const itemExit = rowTx.selectAll('.acl-row__item')
      .attr('transform', `translate(${x(0)})`);

    itemExit.select('.acl-row__text')
      .attr('x', 0);

    itemExit.select('.acl-row__bar')
      .attr('width', 0);

  }
}
