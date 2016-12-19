import {Model} from 'backbone';
import {Selection} from 'd3-selection';
import {scaleBand} from 'd3-scale';
import {axisLeft} from 'd3-axis';

import 'd3-transition';

import configure from 'util/configure';
import wrap from 'util/wrap';
import * as vars from 'data/variables';
import Chart from 'views/chart';
import {groupedData, CsvData} from 'pages/score-gaps/bar-data';
import {formatValue} from 'codes';

import * as scales from 'components/scales';
import * as axis from 'components/axis';

@configure({
  className: 'chart chart--bar',
})
export default class BarChart extends Chart<Model> {
  protected marginLeft = 100;
  protected marginRight = 100;
  protected marginBottom = 40;
  protected marginTop = 0;

  protected percentAxis: Selection<SVGGElement, {}, null, void>;
  protected categoryAxis: Selection<SVGGElement, {}, null, void>;

  protected firstRender = true;

  delegateEvents(): this {
    super.delegateEvents();

    this.on('variable:select', this.onVariableSelect);

    return this;
  }

  render(): this {
    super.render();

    if (this.firstRender) {
      this.percentAxis = this.d3el.append<SVGGElement>('g');
      this.categoryAxis = this.d3el.append<SVGGElement>('g');

      this.firstRender = false;
    }

    this.renderData(groupedData[vars.SDRACE.id]);

    return this;
  }

  protected onVariableSelect(variable: vars.Variable): void {
    this.renderData(groupedData[variable.id]);
  }

  protected renderData(data: CsvData[]): void {

    // setup and add the x axis
    const percent = scales.percent()
      .bounds([0, 100])
      .domain([0, 100]);

    const percentAxis = axis.horizontalBottom()
      .scale(percent);

    const chartHeight = 300,
        chartWidth = percent.range()[1];

    this.height(chartHeight)
      .width(chartWidth);

    this.percentAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop + this.innerHeight})`)
      .call(percentAxis);

    // setup and add the y axis
    const category = scaleBand()
      .domain(data.map(d => d.name))
      .range([0, chartHeight])
      .padding(0.5);

    const categoryAxis = axisLeft(category);

    this.categoryAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(categoryAxis);

    // wrap the category names
    this.categoryAxis.selectAll('text')
      .call(wrap, this.marginLeft - 5);

    // set the bar groups
    const barUpdate = this.inner.selectAll('.gap-bar')
      .data(data);

    barUpdate.interrupt()
      .transition()
      .attr('transform', d => `translate(0, ${category(d.name)})`);

    // add group element
    const barEnter = barUpdate.enter()
      .append('g')
      .classed('gap-bar', true)
      .attr('transform', d => `translate(0, ${category(d.name)})`);

    // helper function to get the proper bar width
    const barWidth = (value: number): number => {
      return percent((value === 999) ? 0 : value);
    };

    // add bar rect svg
    barEnter.append('rect')
      .classed('gap-bar__bar', true)
      .attr('height', category.bandwidth())
      .attr('width', 0)
      .merge(barUpdate.select('.gap-bar__bar'))
      .transition()
      .attr('height', category.bandwidth())
      .attr('width', d => barWidth(d.value));

    // add bar percentage text
    const barText = barEnter.append('text')
      .classed('gap-bar__text', true)
      .attr('y', (category.bandwidth() / 2) + 5);

    barText.merge(barUpdate.select('.gap-bar__text'))
      .transition()
      .attr('y', (category.bandwidth() / 2) + 5)
      .attr('x', d => barWidth(d.value) + 5);

    barText.append('tspan')
      .classed('gap-bar__text-value', true)
      .merge(barUpdate.select('.gap-bar__text-value'))
      .text(d => formatValue(d.value, '', d.errorFlag));

    // add maximum score text to focal category
    barText.data([data[0]])
      .append('tspan')
      .classed('gap-bar__text-outer', true)
      .text('% of maximum score');

    // handle the exit transitions for the bar and text elements
    const barExit = barUpdate.exit()
      .transition()
      .remove();

    barExit.select('.gap-bar__bar')
      .attr('width', 0);

    barExit.select('.gap-bar__text')
      .attr('x', 0);
  }
}
