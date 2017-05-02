import {select, Selection} from 'd3-selection';
import {Model, ViewOptions, EventsHash} from 'backbone';
import {scalePoint, scaleSqrt} from 'd3-scale';
import {extent, range} from 'd3-array';
import {partition, findWhere} from 'underscore';

import configure from 'util/configure';
import wrap from 'util/wrap';
import * as analytics from 'util/analytics';
import {Variable} from 'data/variables';
import Chart from 'views/chart';
import * as scales from 'components/scales';
import * as axes from 'components/axis';
import {horizontalBottom} from 'components/categorical-axis';
import {formatValue} from 'codes';

import {Grouped, loadGaps} from 'pages/opportunities-and-access/bubble-data';

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
  protected firstVisibleRender = true;
  protected data: Grouped[];

  protected marginTop = 60;
  protected marginLeft = 50;
  protected marginRight = 0;
  protected marginBottom = 100;

  constructor(options: BubbleChartOptions) {
    super(options);

    this.variable = options.variable;
  }

  events(): EventsHash {
    return {
      'click .bubble:not(.bubble--suppressed)': 'bubbleClicked',
    };
  }

  protected bubbleClicked(event: JQueryMouseEventObject): void {
    const focal = select(event.currentTarget),
          focalClicked = focal.classed('focal'),
          bubbles = this.selectAll('.bubble:not(.bubble--suppressed)');

    if (focalClicked) {
      // focal element clicked, "close" bubbles by removing is-active and focal classes from all bubbles
      bubbles
        .classed('is-active', false)
        .classed('focal', false);

      // remove elements of sig test
      this.selectAll('.bubble__sig')
        .html('');

      analytics.push('_trackEvent', 'Bubble Chart', 'Bubble Clicked', this.variable.id, 'closed');
    } else {
      bubbles
        // set our bubbles to active to display their values
        .classed('is-active', true)
        // set focal class conditionally
        .classed('focal', function() {
          return this === event.currentTarget;
        });

      // get focal element's data
      const focalData = focal.datum() as Grouped,
            focalIndex = focalData.mean.categoryindex,
            category = focalData.mean.category;

      analytics.push('_trackEvent', 'Bubble Chart', 'Bubble Clicked', this.variable.id, category);

      // load our sig test data and set the text
      loadGaps(this.variable, focalIndex)
        .then(data => {
          this.selectAll('.bubble__sig')
            .attr('class', function() {
              const classes = ['bubble__sig'];
              // get the category index from the data associated with this element
              const datum = select(this).datum() as Grouped,
                    categoryIndex = datum.mean.categoryindex,
                    // gap data categories are increased by 1 (categoryindex: 0 => 1), so find data accordingly
                    gapData = findWhere(data, { categorybindex: categoryIndex + 1 });

              // if no data found, this most likely means we're on the focal category, which should have no text
              if (!gapData) {
                classes.push('bubble__sig--no-text');
              } else if (gapData.sig !== '>' && gapData.sig !== '<') {
                // add "no sig" class
                classes.push('bubble__sig--none');
              }

              return classes.join(' ');
            })
            .text(function() {
              // get the category index from the data associated with this element
              const element = select(this);

              // instead of going through the data, we simply check for classes
              if (element.classed('bubble__sig--no-text')) {
                return 'selected category';
              }

              return (element.classed('bubble__sig--none')) ? 'score not significantly different'
                : 'score significantly different';
            })
            .call(wrap, 50);
        })
        .done();
    }
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
    this.data = data;

    const {categories} = this.variable,
          chartWidth = 600;

    // It's much easier to work with partitioned data here:
    // The variable `valid' will hold rows for which we are drawing circles,
    // and `suppressed' will hold the rows for which we have to draw the double-dagger
    // symbol.
    const [valid, suppressed] = partition(this.data, ({mean, percent}) => {
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

    // add Sig Test text element to bubble
    bubbleEnter.append('text')
      .classed('bubble__sig', true)
      .attr('y', '-5em');

    // Show suppressed rows as dagger footnotes
    this.inner.selectAll('.bubble--suppressed')
      .data(suppressed)
      .enter()
      .append('g')
      .classed('bubble bubble--suppressed', true)
      .append('text')
      .classed('bubble__label', true)
      .attr('y', this.innerHeight - 4)
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

      if (!this.firstVisibleRender) {
        // response axis was not previously rendered, draw on
        this.drawResponseAxis();
        this.firstVisibleRender = true;
      }
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

    // if data is loaded, draw on
    if (this.data) {
      this.drawResponseAxis();
    } else {
      // data has not loaded
      this.firstVisibleRender = false;
    }
  }

  protected drawResponseAxis(): void {
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

    // update the bottom margin based on the response axis height
    const axisBbox = this.responseAxis.node().getBBox();
    this.margins({ bottom: Math.ceil(axisBbox.height) + 3 });
  }
}
