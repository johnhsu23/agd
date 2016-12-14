import {ViewOptions, Model} from 'backbone';

import configure from 'util/configure';
import D3View from 'views/d3';
import {scaleLinear} from 'd3-scale';

import {SampleQuestion} from 'data/sample-questions';

import {questionData, QuestionBarData} from 'pages/questions-analysis/question-header-data';
import * as template from 'text!templates/sample-question-header-bar.html';

export interface QuestionHeaderBarOptions extends ViewOptions<Model> {
  question: SampleQuestion;
}

@configure({
  className: 'header-bar sample-question-bar',
})
export default class HeaderBar extends D3View<HTMLDivElement, Model> {
  template = () => template;

  protected question: SampleQuestion;
  protected data: QuestionBarData;

  constructor(options: QuestionHeaderBarOptions) {
    super(options);

    this.question = options.question;
    this.data = questionData[this.question.naepid];
  }

  render(): this {
    super.render();

    this.drawBar();

    return this;
  }

  protected drawBar(): void {
    // height and width variables for chart and bar use
    const chartHeight = 42,
      chartWidth = 133,
      barHeight = 32,
      barWidth = chartWidth - 1; // accommodates for stroke-width

    // set SVG height and width
    const svg = this.d3el.select('svg')
      .attr('height', chartHeight)
      .attr('width', chartWidth);

    // set our scale for percentages
    const scale = scaleLinear()
      .domain([0, 100])
      .range([0, barWidth]);

    // place background and percentage bar
    const bar = svg.selectAll('rect')
      .data([scale(100), scale(this.data.value)]);

    bar.enter()
      .append('rect')
        .attr('x', 0)
        .attr('y', (chartHeight - barHeight) / 2)
        .attr('class', (_, i) => (i === 0) ? 'bar__background' : 'bar__percent')
        .attr('width', (d, i) => (i === 0) ? d : 0)
        .attr('height', barHeight)
      .transition()
        .attr('width', d => d);

    // place y axis manually
    const yAxis = svg.selectAll('line')
      .data([0]);

    yAxis.enter()
      .append('line')
      .classed('y-axis', true)
      .attr('y2', chartHeight);

    // set text elements
    this.$('.header-bar-label__value')
      .text(Math.round(this.data.value));

    this.$('.header-bar-label__category')
      .text(this.data.label);

    this.$('.question-labels__classification')
      .text(this.question.classification);

    this.$('.question-labels__type')
      .text((this.question.type === 'MC') ? 'Multiple choice' : 'Constructed-response');
  }
}
