import {sortBy} from 'underscore';
import {select, Selection} from 'd3-selection';
import {scaleBand, ScaleBand} from 'd3-scale';

import {scale as makeScale, Scale} from 'components/scale';
import {stack as makeStack, Bar} from 'components/stack';
import * as codes from 'codes';

import {Data} from 'api/tuda-acrossyear';

const duration = 500;

function order(data: Data[]): Data[] {
  return sortBy(data, d => {
    switch (d.stattype) {
      case 'AB':
        return 0;

      case 'AP':
        return 1;

      case 'BB':
        return 2;

      case 'BA':
        return 3;

      case 'PR':
        return 4;

      case 'AD':
        return 5;
    }
  });
}

function shouldShiftRight<T>(d: Bar<T>): boolean {
  return d.size < 6;
}

function stackedBarOffset<T>(d: Bar<T>): number {
  if (shouldShiftRight(d)) {
    return d.size + 2;
  }

  return d.size / 2;
}

export interface AclBar {
  <T>(selection: Selection<SVGGElement, Data[], null, T>): void;

  x(): Scale;
  x(x: Scale): this;

  y(): ScaleBand<number>;
  y(y: ScaleBand<number>): this;

  baseline(): number;
  baseline(baseline: number): this;
}

export default aclBar;
export function aclBar(): AclBar {
  type Setter<T> = {
    (): T;
    (value: T): AclBar;
  };

  let baseline = 1,
      x = makeScale(),
      y = scaleBand<number>();

  const stack = makeStack<Data>()
      .defined(d => !(codes.isNotApplicable(d.TargetErrorFlag) || codes.isNotAvailable(d.TargetErrorFlag)))
      .size(d => x(d.targetvalue) - x(0));

  const aclBar = function <T>(rowUpdate: Selection<SVGGElement, Data[], null, T>) {
    rowUpdate.transition()
      .duration(duration)
      .attr('transform', ([row]) => `translate(0, ${y(row.targetyear)})`);

    rowUpdate.each(function (rows) {
      rows = order(rows);

      const sel = select(this),
            label = rows[0].targetyear,
            stacked = stack(rows.slice(2)),
            offset = x(0) - stacked[baseline].offset;

      sel.select('.acl-row__label')
        .text(label);

      const update = sel.selectAll<SVGGElement, Bar<Data>>('.acl-row__item')
        .data(stacked, d => d.stattype);

      const tx = update.transition()
        .duration(duration)
        .attr('transform', d => `translate(${d.offset + offset})`);

      update.select('.acl-row__text')
        .text(d => codes.formatValue(d.targetvalue, d.sig, d.TargetErrorFlag))
        .classed('is-shifted-right', shouldShiftRight);

      tx.select('.acl-row__text')
        .attr('x', stackedBarOffset);

      tx.select('.acl-row__bar')
        .attr('width', d => d.size);
    });

    const rowEnter = rowUpdate.enter()
      .append('g')
      .order()
      .classed('acl-row', true)
      .attr('transform', ([row]) => `translate(0, ${y(row.targetyear)})`);

    rowEnter.each(function (rows) {
      rows = order(rows);

      const sel = select(this),
            label = rows[0].targetyear,
            stacked = stack(rows.slice(2)),
            offset = x(0) - stacked[baseline].offset;

      sel.append('text')
        .classed('acl-row__label', true)
        .text(label)
        .attr('x', -10)
        .attr('y', '1.1em');

      const enter = sel.selectAll<SVGGElement, Bar<Data>>('.acl-row__item')
        .data(stacked, d => d.stattype)
        .enter()
        .append('g')
        .classed('acl-row__item', true)
        .attr('transform', `translate(${x(0)})`);

      enter
        .transition()
        .duration(duration)
        .attr('transform', d => `translate(${d.offset + offset})`);

      enter
        .append('rect')
        .attr('class', d => `acl-row__bar acl-row__bar--${d.stattype.toLowerCase()}`)
        .attr('width', 0)
        .attr('height', y.bandwidth())
        .transition()
        .duration(duration)
        .attr('width', d => d.size);

      enter
        .append('text')
        .classed('acl-row__text', true)
        .classed('is-shifted-right', shouldShiftRight)
        .attr('x', 0)
        .attr('y', '1.1em')
        .text(d => codes.formatValue(d.targetvalue, d.sig, d.TargetErrorFlag))
        .transition()
        .duration(duration)
        .attr('x', stackedBarOffset);
    });

    const rowExit = rowUpdate.exit();

    rowExit.select('.acl-row__label')
      .classed('is-exiting', true)
      .transition()
      .delay(duration)
      .remove();

    const rowTx = rowExit
      .transition()
      .duration(duration)
      .remove();

    const itemExit = rowTx.selectAll('.acl-row__item')
      .attr('transform', `translate(${x(0)})`);

    itemExit.select('.acl-row__text')
      .attr('x', 0);

    itemExit.select('.acl-row__bar')
      .attr('width', 0);
  } as AclBar;

  aclBar.x = function (value?: Scale): AclBar | Scale {
    if (arguments.length) {
      x = value;
      return aclBar;
    }

    return x;
  } as Setter<Scale>;

  aclBar.y = function (value?: ScaleBand<number>): AclBar | ScaleBand<number> {
    if (arguments.length) {
      y = value;
      return aclBar;
    }

    return y;
  } as Setter<ScaleBand<number>>;

  aclBar.baseline = function (value?: number): AclBar | number {
    if (arguments.length) {
      baseline = +value;
      return aclBar;
    }

    return baseline;
  } as Setter<number>;

  return aclBar;
}
