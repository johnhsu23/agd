import {descending, scale} from 'd3';
import {sortBy} from 'underscore';

import Chart from 'views/chart';
import {yearsForGrade} from 'data/assessment-years';
import * as scales from 'components/scales';

import makeBar from 'components/acl-bar';

import {GENDER} from 'data/variables';

import {Data} from 'pages/achievement-levels/groups-data';

import context from 'models/context';

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

type Row = Data[];
function group(data: Data[]): Row[][] {
  const grouped: Row[] = [];
  for (const row of data) {
    let group = grouped[row.categoryindex];
    if (!group) {
      group = grouped[row.categoryindex] = [];
    }

    group.push(row);
  }

  return grouped.map(group => {
    const dict: { [key: number]: Row } = Object.create(null);

    for (const row of group) {
      if (!dict[row.targetyear]) {
        dict[row.targetyear] = [];
      }

      dict[row.targetyear].push(row);
    }

    return Object.keys(dict)
      .map(year => dict[+year])
      .sort(([a], [b]) => descending(a.targetyear, b.targetyear));
  });
}

const headerHeight = 30,
      headerPadding = 10,
      barHeight = 30,
      duration = 250;

export default class GroupsChart extends Chart<Data> {
  protected marginBottom = 30;
  protected marginLeft = 50;
  protected marginRight = 50;

  protected firstRender = true;

  renderData(data: Data[]): void {
    const grouped = group(data);

    const x = scales.percent()
      .domain([-100, 100]);

    const [lo, hi] = x.range();
    this.width(hi - lo);

    const years = sortBy(yearsForGrade(context.grade), year => -year);
    const y = scale.ordinal<number, number>()
      .domain(years)
      .rangeRoundBands([0, barHeight * years.length], 0.125);

    const groupHeight = headerHeight + barHeight * years.length,
          height = grouped.length * groupHeight,
          delay = this.height() > height ? 250 : 0;

    if (this.firstRender) {
      this.height(height);
    } else if (this.innerHeight !== height) {
      this.d3el
        .transition()
        .delay(delay)
        .duration(duration)
        .style('height', this.computeHeight(height) + 'px');

      this.innerHeight = height;
    }

    const bar = makeBar().x(x).y(y);

    const subchartUpdate = this.inner.selectAll('.subchart')
      .data(grouped);

    subchartUpdate.transition()
      .delay(delay)
      .duration(duration)
      .attr('transform', (_, i) => `translate(0, ${headerHeight + i * groupHeight})`);

    subchartUpdate.selectAll('.acl-row')
      .data<Data[]>(d => d.map(order), ([d]) => '' + d.targetyear)
      .call(bar);

    const subchartEnter = subchartUpdate.enter()
      .append('g')
      .classed('subchart', true)
      .attr('transform', (_, i) => `translate(0, ${headerHeight + i * groupHeight})`);

    const header = subchartEnter.append('g')
      .classed('subchart__header', true);

    header.append('rect')
      .classed('subchart__header-backdrop', true)
      .attr('x', -this.marginLeft)
      .attr('width', this.computeWidth(this.innerWidth))
      .attr('y', -headerHeight)
      .attr('height', headerHeight);

    header.append('text')
      .classed('subchart__header-title', true)
      .attr('x', headerPadding - this.marginLeft)
      .attr('y', -headerPadding)
      .text((_, i) => GENDER.categories[i]);

    subchartEnter.selectAll('.acl-row')
      .data<Data[]>(d => d.map(order), ([d]) => '' + d.targetyear)
      .call(bar);

    this.firstRender = false;
  }
}
