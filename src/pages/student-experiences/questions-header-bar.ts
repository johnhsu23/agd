import {ViewOptions, Model} from 'backbone';
import {Selection} from 'd3-selection';

import configure from 'util/configure';
import Chart from 'views/chart';

import context from 'models/context';
import {ContextualVariable} from 'data/contextual-variables';

import {load, Data} from 'pages/student-experiences/questions-header-data';

//import * as scales from 'components/scales';

export interface QuestionsHeaderBarOptions extends ViewOptions<Model> {
  variable: ContextualVariable;
}

// helper function to get the specific category index that we need
const getCategoryIndex = (variable: string): number => {
  switch (variable) {
    case 'BM00010':
      return 2;
    case 'SQ00070':
    case 'BV00008':
    case 'SQ00070':
      return 1;
    default:
      return 0;
  }
};

@configure({
  className: 'chart chart--bar',
})
export default class HeaderBar extends Chart<Model> {
  protected yAxis: Selection<SVGGElement, {}, null, void>;

  protected variable: ContextualVariable;

  constructor(options: QuestionsHeaderBarOptions) {
    super(options);

    this.variable = options.variable;
  }

  render(): this {
    super.render();

    this.yAxis = this.d3el.append<SVGGElement>('g');

    load(context.subject, this.variable, getCategoryIndex(this.variable.id))
      .then(data => this.loaded(data[0]))
      .done();

    return this;
  }

  protected loaded(data: Data): void {

    // set height and width for chart and bar
    const chartHeight = 42,
      chartWidth = 465,
      barHeight = 32,
      barWidth = 132;

    this.height(chartHeight)
      .width(chartWidth);

    // NOTE: temporary catch until all data is available in the database
    if (!data) {
      return;
    }

    // place background bar and percent bar
    const bar = this.inner.selectAll('rect')
      .data([barWidth, Math.round((data.targetvalue * barWidth) / 100)]);

    bar.enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (chartHeight - barHeight) / 2)
      .attr('class', (_, i) => (i === 0) ? 'bg-bar' : 'percent-bar')
      .attr('width', d => d)
      .attr('height', barHeight);

    // place y axis manually
    const yAxis = this.inner.selectAll('path')
      .data([0]);

    yAxis.enter()
      .append('path')
      .attr('d', `M0 0 H 1 V ${chartHeight} H 0 Z`);

    // place text at end of bar
    const text = this.inner.selectAll('text')
      .data([data]);

    const textEnter = text.enter()
      .append('text')
      .attr('x', barWidth + 10)
      .attr('y', (chartHeight / 2) + 5);

    textEnter.append('tspan')
      .classed('bar__text__value', true)
      .text(d => Math.round(d.targetvalue));

    textEnter.append('tspan')
      .classed('bar__text__outer', true)
      // TODO: use actual variable language. not sure where to get currently
      .text(d => '% ' + this.variable.categories[d.categoryindex]);
  }
}
