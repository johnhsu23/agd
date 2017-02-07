import {Model} from 'backbone';
import {Selection} from 'd3-selection';
import {scaleBand} from 'd3-scale';

import 'd3-transition';

import configure from 'util/configure';
import * as vars from 'data/variables';
import Chart from 'views/chart';
import {verticalLeft} from 'components/categorical-axis';

import {groupedData, CsvData} from 'pages/score-gaps/bar-data';
import {formatValue} from 'codes';

import * as scales from 'components/scales';
import * as axis from 'components/axis';

@configure({
  className: 'chart chart--bar',
})
export default class BarChart extends Chart<Model> {
  protected marginLeft = 120;
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

    return this;
  }

  protected onVariableSelect(variable: vars.Variable): void {
    this.renderData(groupedData[variable.id]);
  }

  onAttach(): void {
    if (super.onAttach) {
      super.onAttach();
    }

    this.renderData(groupedData[vars.SDRACE.id]);
  }

  protected renderData(data: CsvData[]): void {
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

    // setup and add the y axis
    const category = scaleBand()
      .domain(data.map(d => d.name))
      .range([0, chartHeight])
      .padding(0.5);

    const categoryAxis = verticalLeft(chartHeight)
      .scale(category)
      .wrap(this.marginLeft - 5);

    this.categoryAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(categoryAxis);

    // set the bar groups
    const barUpdate = this.inner.selectAll('.bar--gap')
      .data(data);

    barUpdate.interrupt()
      .transition()
      .attr('transform', d => `translate(0, ${category(d.name)})`);

    // add group element
    const barEnter = barUpdate.enter()
      .append('g')
      .classed('bar--gap', true)
      .attr('transform', d => `translate(0, ${category(d.name)})`);

    // helper function to get the proper bar width
    const barWidth = (value: number): number => {
      return percent((value === 999) ? 0 : value);
    };

    // add bar rect svg
    barEnter.append('rect')
      .classed('bar--gap__bar', true)
      .attr('height', category.bandwidth())
      .attr('width', 0)
      .merge(barUpdate.select('.bar--gap__bar'))
      .transition()
      .attr('height', category.bandwidth())
      .attr('width', d => barWidth(d.value));

    // add bar percentage text
    const barText = barEnter.append('text')
      .classed('bar--gap__text', true)
      .attr('y', (category.bandwidth() / 2) + 5);

    barText.merge(barUpdate.select('.bar--gap__text'))
      .transition()
      .attr('y', (category.bandwidth() / 2) + 5)
      .attr('x', d => barWidth(d.value) + 5);

    barText.append('tspan')
      .classed('bar--gap__text-value', true)
      .merge(barUpdate.select('.bar--gap__text-value'))
      .text(d => formatValue(d.value, '', d.errorFlag));

    // handle the exit transitions for the bar and text elements
    const barExit = barUpdate.exit()
      .transition()
      .remove();

    barExit.select('.bar--gap__bar')
      .attr('width', 0);

    barExit.select('.bar--gap__text')
      .attr('x', 0);
  }
}
