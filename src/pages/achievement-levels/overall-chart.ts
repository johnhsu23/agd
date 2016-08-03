import * as d3 from 'd3';
import {sortBy} from 'underscore';

import Chart from 'views/chart';

import * as codes from 'codes';
import makeStack from 'components/stack';
import * as scales from 'components/scales';
import context from 'models/context';
import {Data} from 'api/tuda-acrossyear';
import {yearsForGrade} from 'data/assessment-years';

const rowHeight = 30,
      duration = 500;

type Baseline = 'basic' | 'proficient';

export default class OverallChart extends Chart<Data> {
  protected baseline: Baseline = 'basic';

  setBaseline(baseline: Baseline): void {
    this.baseline = baseline;
  }

  renderData(rows: Data[][]): void {
    console.trace('hello world');

    const base = this.baseline === 'basic' ? 1 : 2;

    const height = rows.length * rowHeight;
    this.height(height);

    const y = d3.scale.ordinal<number, number>()
      .domain(sortBy(yearsForGrade(context.grade), n => -n))
      .rangeRoundBands([0, height], 0.125);

    const x = scales.percent()
      .domain([-100, 100]);

    const [lo, hi] = x.range();
    this.width(hi - lo);

    const stack = makeStack<Data>()
      .defined(d => !(codes.isNotApplicable(d.TargetErrorFlag) || codes.isNotAvailable(d.TargetErrorFlag)))
      .size(d => x(d.targetvalue) - x(0));

    const rowUpdate = this.inner.selectAll('.acl-row')
      .data(rows.map(stack), ([row]) => '' + row.targetyear);

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
      .append('g')
      .classed('acl-row', true)
      .attr('transform', ([row]) => `translate(0, ${y(row.targetyear)})`);

    rowEnter.each(function (rows) {
      const sel = d3.select(this),
            ba = rows[base];

      sel.append('text')
        .classed('acl-row__label', true)
        .text(ba.targetyear)
        .attr('dy', '1em');

      const baseline = x(0) - ba.offset;

      const enter = sel.selectAll('.acl-row__item')
        .data(rows, d => d.stattype)
        .enter()
        .append('g')
        .classed('acl-row__item', true)
        .attr('transform', d => `translate(${d.offset + baseline})`);

      enter
        .append('rect')
        .attr('class', d => `acl-row__bar acl-row__bar--${d.stattype.toLowerCase()}`)
        .attr('width', d => d.size)
        .attr('height', y.rangeBand());

      enter
        .append('text')
        .classed('acl-row__text', true)
        .classed('is-shifted-right', d => d.size < 5)
        .attr('x', d => {
          if (d.size > 5) {
            return d.size / 2;
          }

          return d.size + 2;
        })
        .attr('y', '1.1em')
        .text(d => codes.formatValue(d.targetvalue, d.sig, d.TargetErrorFlag));
    });
  }
}
