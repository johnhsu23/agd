import {Selection} from 'd3-selection';
import {Model, ViewOptions} from 'backbone';
import {scalePoint, scaleSqrt} from 'd3-scale';
import {extent, range} from 'd3-array';
import {partition} from 'underscore';

import wrap from 'util/wrap';
import configure from 'util/configure';
import {Variable} from 'data/variables';
import Chart from 'views/chart';
import * as scales from 'components/scales';
import * as axes from 'components/axis';
import {formatValue} from 'codes';

import {Grouped} from 'pages/student-experiences/bubble-data';

interface BubbleChartOptions extends ViewOptions<Model> {
  variable: Variable;
}

@configure({
  className: 'chart chart--bubble',
})
export default class BubbleChart extends Chart<Model> {
  protected variable: Variable;

  protected scoreAxis: Selection<SVGGElement, {}, null, void>;
  protected responseAxis: Selection<SVGGElement, {}, null, void>;

  protected firstRender = true;

  protected marginTop = 30;
  protected marginLeft = 50;
  protected marginRight = 0;
  protected marginBottom = 100;

  constructor(options: BubbleChartOptions) {
    super(options);

    this.variable = options.variable;
  }

  render(): this {
    super.render();

    if (this.firstRender) {
      this.scoreAxis = this.d3el.append<SVGGElement>('g');
      this.responseAxis = this.d3el.append<SVGGElement>('g');

      this.firstRender = false;
    }

    return this;
  }

  public renderData(data: Grouped[]): void {
    const {categories} = this.variable,
          chartWidth = 600;

    // It's much easier to work with partitioned data here:
    // The variable `valid' will hold rows for which we are drawing circles,
    // and `suppressed' will hold the rows for which we have to draw the double-dagger
    // symbol.
    const [valid, suppressed] = partition(data, ({mean, percent}) => {
      return mean.isTargetStatDisplayable !== 0
          && percent.isTargetStatDisplayable !== 0;
    });

    const response = scalePoint<number>()
      .padding(0.5)
      .domain(range(categories.length))
      .range([0, chartWidth]);

    const score = scales.score()
      .bounds([0, 300])
      .reverse();

    // Calculate bubble size relative to a scale score interval, mostly because
    // it makes reasoning about the bubble slightly easier.
    const multiplier = 1.2,
          // Maximum bubble radius, in output units
          radius = score.intervalSize() * multiplier,
          // Maximum bubble radius, in input units (see below)
          offset = score.interval() * multiplier;

    const percentage = scaleSqrt()
      .domain([0, 100]) // Fixed at [0, 100] for consistency reasons
      .range([0, radius]);

    const scores = extent(valid, ({mean}) => mean.targetvalue);

    // Adjust score domain so that percentages will fit neatly on the chart
    scores[0] -= offset;
    scores[1] += offset;

    score.domain(scores);

    this
      .width(chartWidth)
      .height(score.size());

    const scoreAxis = axes.verticalLeft()
      .scale(score);

    this.scoreAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(scoreAxis);

    this.inner.selectAll('circle')
      .data(valid)
      .enter()
      .append('circle')
      .attr('cx', ({mean}) => response(mean.categoryindex))
      .attr('cy', ({mean}) => score(mean.targetvalue))
      .attr('r', ({percent}) => percentage(percent.targetvalue));

    // Show suppressed rows as dagger footnotes
    this.inner.selectAll('text')
      .data(suppressed)
      .enter()
      .append('text')
      .attr('y', this.innerHeight)
      .attr('x', ({mean}) => response(mean.categoryindex))
      .attr('text-anchor', 'middle')
      .text(({mean, percent}) => {
        // Pick the row that caused us to be suppressed, and show the formatted error symbol for it.
        if (mean.isTargetStatDisplayable === 0) {
          return formatValue(mean.targetvalue, '', mean.TargetErrorFlag);
        } else {
          return formatValue(percent.targetvalue, '', percent.TargetErrorFlag);
        }
      });

    // NB. This really needs to be folded into a categorical axis component of some kind

    this.responseAxis
      .classed('axis axis--horizontal-bottom', true)
      .attr('transform', `translate(${this.marginLeft}, ${this.innerHeight + this.marginTop})`)
      .selectAll('text')
      .data(categories)
      .enter()
      .append('text')
      .classed('axis__label', true)
      .text(d => d)
      .attr('x', (_, i) => response(i))
      .attr('y', '1.37em');
  }

  protected onVisibilityVisible(): void {
    // This handles the "visibility:visible" event. There are two reasons we have to handle this here and not in a
    // standard Marionette lifecycle event:
    // 1. We haven't actually been attached to the DOM yet.
    // 2. The accordion's children aren't all visible at the time the view is attached.
    //
    // A consequence of #2 is that our <text> elements will have *no* computed metrics. So, we have to instead wait for
    // when we are told we're visible and only then can we use the wrap utility.
    //
    // Whee!

    const response = scalePoint<number>()
      .padding(0.5)
      .domain(range(this.variable.categories.length))
      .range([0, 600]);

    this.responseAxis
      .selectAll('.axis__label')
      // Fudge the wrapping size by a few pixels on each side to avoid well-filled columns bumping up against each other
      .call(wrap, response.step() - 8);
  }
}
