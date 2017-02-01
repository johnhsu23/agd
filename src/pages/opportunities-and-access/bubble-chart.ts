import {select, Selection} from 'd3-selection';
import {Model, ViewOptions} from 'backbone';
import {scalePoint, scaleSqrt} from 'd3-scale';
import {extent, range} from 'd3-array';
import {partition} from 'underscore';

import configure from 'util/configure';
import {Variable} from 'data/variables';
import Chart from 'views/chart';
import * as scales from 'components/scales';
import * as axes from 'components/axis';
import {horizontalBottom} from 'components/categorical-axis';
import {formatValue} from 'codes';

import {Grouped} from 'pages/opportunities-and-access/bubble-data';

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

  protected marginTop = 60;
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
      .scale(score)
      .title(['Scale', 'Score']);

    this.scoreAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(scoreAxis);

    const bubbleUpdate = this.inner.selectAll('.bubble')
      .data(valid);

    const bubbleEnter = bubbleUpdate.enter()
      .append('g')
      .classed('bubble', true)
      .attr('transform', ({mean}) => {
        const x = response(mean.categoryindex),
              y = score(mean.targetvalue);

        return `translate(${x}, ${y})`;
      })
      .on('click', function () {
        const elt = select(this),
              isActive = elt.classed('is-active');

        elt.classed('is-active', !isActive);
      });

    bubbleEnter.append('circle')
      .attr('r', ({percent}) => percentage(percent.targetvalue));

    const bubbleDetail = bubbleEnter.append('text')
      .classed('bubble__detail', true);

    bubbleDetail.append('tspan')
      .classed('bubble__detail--strong', true)
      .attr('x', 0)
      .attr('y', 0)
      .text('Score: ');

    bubbleDetail.append('tspan')
      .text(({mean}) => formatValue(mean.targetvalue, '', mean.TargetErrorFlag));

    bubbleDetail.append('tspan')
      .classed('bubble__detail--strong', true)
      .attr('x', 0)
      .attr('y', '1em')
      .text('Percentage: ');

    bubbleDetail.append('tspan')
      .text(({percent}) => formatValue(percent.targetvalue, '', percent.TargetErrorFlag));

    // Show suppressed rows as dagger footnotes
    this.inner.selectAll('.bubble--suppressed')
      .data(suppressed)
      .enter()
      .append('g')
      .classed('bubble bubble--suppressed', true)
      .append('text')
      .classed('bubble__label', true)
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
    // This means that it's easier to put the entire axis code here (because the categorical axis knows it will need to
    // wrap long category names) than to break up the rendering/wrapping.
    //
    // Whee!

    const response = scalePoint<number>()
      .padding(0.5)
      .domain(range(this.variable.categories.length))
      .range([0, 600]);

    const responseAxis = horizontalBottom<number>(600)
      .categories(this.variable.categories)
      .scale(response)
      // Use a fudge factor to keep the classroom type labels from bumping into each other
      .wrap(response.step() - 5);

    this.responseAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.innerHeight + this.marginTop})`)
      .call(responseAxis);
  }
}
