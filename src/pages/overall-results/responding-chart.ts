import {Model} from 'backbone';
import {Selection} from 'd3-selection';
import {scaleBand} from 'd3-scale';

import 'd3-transition';

import configure from 'util/configure';
import Chart from 'views/chart';
import {data, scoreText} from 'pages/overall-results/responding-data';

import * as scales from 'components/scales';
import * as axis from 'components/axis';
import {verticalLeft} from 'components/categorical-axis';

@configure({
  className: 'chart chart--bar',
})
export default class BarChart extends Chart<Model> {
  protected marginLeft = 115;
  protected marginRight = 100;
  protected marginBottom = 70;
  protected marginTop = 60;

  protected percentAxis: Selection<SVGGElement, {}, null, void>;
  protected categoryAxis: Selection<SVGGElement, {}, null, void>;

  protected firstRender = true;

  render(): this {
    super.render();

    if (this.firstRender) {
      this.percentAxis = this.d3el.append<SVGGElement>('g');
      this.categoryAxis = this.d3el.append<SVGGElement>('g');

      this.firstRender = false;
    }

    return this;
  }

  onAttach(): void {
    if (super.onAttach) {
      super.onAttach();
    }

    this.renderData();
  }

  protected renderData(): void {
    // setup and add the x axis
    const percent = scales.percent()
      .bounds([0, 100])
      .domain([0, 100]);

    const percentAxis = axis.horizontalBottom()
      .scale(percent)
      .title(['Percent of Maximum Score']);

    const chartHeight = 300,
        chartWidth = percent.range()[1];

    this.height(chartHeight)
      .width(chartWidth);

    this.percentAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop + this.innerHeight})`)
      .call(percentAxis);

    const textX = ['Percent of Maximum Score'],
       lineHeight = -1.1,
       textLengthX = textX.length - 1;

    // Select all child <tspan> elements of the axis title's <text> element
    const tspansX = this.percentAxis.append('text')
      .classed('axis__title', true)
      .selectAll('tspan')
      .data(textX);

    tspansX.enter()
      .append('tspan')
      .text(d => d)
      .attr('x', this.marginLeft * 2)
      .attr('y', this.marginTop)
      .attr('dy', (_, index) => (textLengthX - index) * lineHeight + 'em');

    // setup and add the y axis
    const category = scaleBand()
      .domain(scoreText)
      .range([0, chartHeight])
      .padding(0.2);

    const categoryAxis = verticalLeft()
      .scale(category)
      .wrap(this.marginLeft - 5); // Fudge factor

    this.categoryAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(categoryAxis);

    const text = ['Percentiles for', 'Responding', 'Scores'],
      textLength = text.length - 1;

    // Select all child <tspan> elements of the axis title's <text> element
    const tspans = this.scoreLvlAxis.append('text')
      .classed('axis__title', true) // add CSS class
      .selectAll('tspan')
      .data(text);

    tspans.enter()
      .append('tspan')
      .text(d => d)
      .attr('x', -10)
      .attr('y', -10)
      .attr('fill', 'black')
      .attr('font-size', '16px')
      .attr('dy', (_, index) => (textLength - index) * lineHeight + 'em');

    // set the bar groups
    const barUpdate = this.inner.selectAll('.bar')
      .data(data);

    barUpdate.interrupt()
      .transition()
      .attr('transform', (_d, i) => `translate(0, ${category(scoreText[i])})`);

    // add group element
    const barEnter = barUpdate.enter()
      .append('g')
      .classed('bar', true)
      .attr('transform', (_d, i) => `translate(0, ${category(scoreText[i])})`);

    // add bar rect svg
    barEnter.append('rect')
      .classed('bar__bar', true)
      .attr('height', category.bandwidth())
      .attr('width', 0)
      .merge(barUpdate.select('.bar__bar'))
      .transition()
      .attr('width', d => percent(d));

    // add bar percentage text
    const barText = barEnter.append('text')
      .classed('bar__text', true)
      .attr('y', category.bandwidth() / 2);

    barText.merge(barUpdate.select('.bar__text'))
      .transition()
      .attr('x', d => percent(d) + 5);

    barText.append('tspan')
      .classed('bar__text-value', true)
      .merge(barUpdate.select('.bar__text-value'))
      .text(d => Math.round(d));
  }
}
