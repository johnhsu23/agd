import * as d3 from 'd3';
import {sortBy} from 'underscore';

import Chart from 'views/chart';

import * as codes from 'codes';
import makeStack from 'components/stack';
import * as scales from 'components/scales';
import context from 'models/context';
import {Data} from 'api/tuda-acrossyear';
import {yearsForGrade} from 'data/assessment-years';

const rowHeight = 30;

export default class OverallChart extends Chart<Data> {
  renderData(rows: Data[][]): void {
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

    const rowEnter = rowUpdate.enter()
      .append('g')
      .classed('acl-row', true)
      .attr('transform', ([row]) => `translate(0, ${y(row.targetyear)})`);

    rowEnter.each(function (rows) {
      const sel = d3.select(this),
            ba = rows[1];

      sel.append('text')
        .text(ba.targetyear)
        .attr('dy', '1em');

      const baseline = x(0) - ba.offset;

      const enter = sel.selectAll('.acl-row__item')
        .data(rows)
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
