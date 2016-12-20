import {ViewOptions, Model} from 'backbone';
import {select, selectAll, Selection} from 'd3-selection';
import {scaleBand} from 'd3-scale';
import {axisLeft} from 'd3-axis';

import {default as makeStack, Bar} from 'components/stack';
import * as scales from 'components/scales';
import {horizontalBottom} from 'components/axis';
import {Variable} from 'data/variables';
import {ContextualVariable} from 'data/contextual-variables';
import configure from 'util/configure';
import Chart from 'views/chart';
import wrap from 'util/wrap';

import {load, Result, Data} from 'pages/student-experiences/group-data';

export interface GroupChatOptions extends ViewOptions<Model> {
  variable: Variable;
  contextualVariable: ContextualVariable;
}

@configure({
  className: 'chart chart--bar chart--bar--stacked',
})
export default class GroupChat extends Chart<Model> {
  // Has the 'visibility:visible' event been fired on us?
  protected visible = false;

  protected marginLeft = 140;
  protected marginRight = 25;
  protected marginBottom = 30;
  protected marginTop = 80;

  protected percentAxis: Selection<SVGGElement, {}, null, void>;
  protected categoryAxis: Selection<SVGGElement, {}, null, void>;
  protected chartHeader: Selection<SVGGElement, {}, null, void>;

  protected firstRender = true;

  protected variable: Variable;
  protected contextualVariable: ContextualVariable;

  constructor(options: GroupChatOptions) {
    super(options);

    this.variable = options.variable;
    this.contextualVariable = options.contextualVariable;
  }

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
      this.chartHeader = this.d3el.append<SVGGElement>('g');

      // apply a white background on first render
      this.selectAll('.background')
        .data([0])
        .enter().insert('rect', '.chart__inner')
          .classed('background', true)
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('fill', 'white');

      this.firstRender = false;
    }

    return this;
  }

  onRender(): void {
    this.updateData();
  }

  protected onVariableSelect(variable: Variable): void {
    this.variable = variable;

    this.updateData();
  }

  protected updateData(): void {
    load(this.variable, this.contextualVariable)
      .then(data => this.loaded(data))
      .then(() => this.updateHeader())
      .done();
  }

  protected loaded(data: Result[]): void {
    // setup and add the x axis
    const percent = scales.percent()
      .domain([0, 100]);

    const percentAxis = horizontalBottom()
      .scale(percent);

    // set chart height and width
    const chartHeight = 300,
        chartWidth = percent.size();

    this.height(chartHeight)
      .width(chartWidth);

    this.percentAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop + this.innerHeight})`)
      .call(percentAxis);

    // setup and add the y axis
    const category = scaleBand()
      .domain(data.map(d => d.key))
      .range([0, chartHeight])
      .padding(0.2);

    const categoryAxis = axisLeft(category);

    this.categoryAxis
      .attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`)
      .call(categoryAxis);

    // wrap the category names
    this.categoryAxis.selectAll('text')
      .call(wrap, this.marginLeft - 15);

    // set series group
    const seriesUpdate = this.inner.selectAll('.series')
      .data(data);

    seriesUpdate.interrupt()
      .transition()
        .attr('transform', d => `translate(0, ${category(d.key)})`);

    // add series group element
    const seriesEnter = seriesUpdate.enter()
      .append('g')
        .attr('class', (_, i) => `series series--${i}`)
        .attr('transform', d => `translate(0, ${category(d.key)})`);

    const stack = makeStack<Data>()
      .defined(d => d.isStatDisplayable !== 0)
      .size(d => percent(d.value));

    const merged = seriesUpdate.merge(seriesEnter);

    // set bar group
    const barUpdate = merged.selectAll('.bar')
      .data(d => stack(d.values));

    barUpdate.interrupt()
      .transition()
        .attr('transform', d => `translate(${d.offset})`);

    // add bar group
    const barEnter = barUpdate.enter()
      .append('g')
        .attr('class', (_, i) => `bar bar--${i}`)
        .attr('transform', d => `translate(${d.offset})`);

    // add bar rect svg
    barEnter.append('rect')
        .classed('bar__bar', true)
        .attr('width', d => d.size)
        .attr('height', category.bandwidth())
      .merge(barUpdate.select('.bar__bar'))
      .transition()
        .attr('height', category.bandwidth())
        .attr('width', d => d.size);

    // add bar text
    barEnter.append('text')
        .classed('bar__text', true)
        .attr('x', d => d.size / 2)
        .attr('y', category.bandwidth() / 2)
        .attr('dy', '0.37em')
        .text(d => Math.round(d.value))
      .merge(barUpdate.select('.bar__text'))
      .transition()
        .attr('x', d => d.size / 2)
        .attr('y', category.bandwidth() / 2)
        .attr('dy', '0.37em')
        .text(d => Math.round(d.value));

    // handle the exit transitions for the elements
    const seriesExit = seriesUpdate.exit()
      .transition()
      .remove();

    seriesExit.select('.bar')
      .attr('transform', 'translate(0)');

    seriesExit.selectAll('.bar__bar')
      .attr('width', 0);

    seriesExit.selectAll('bar__text')
      .attr('x', 0);
  }

  protected onVisibilityVisible(): void {
    this.visible = true;
    this.updateHeader();
  }

  protected onVisibilityHidden(): void {
    this.visible = false;
  }

  protected updateHeader(): void {
    if (!this.visible) {
      // Bail if we're not visible.
      return;
    }

    // Draw the chart's header here: we do a lot of SVG DOM manipulation and need to ensure the chart is actually
    // visible on the screen.
    const categories = this.contextualVariable.categories,
          headerBottom = this.marginTop + 12;

    // get the bar data
    const bars = this.select('.series')
      .selectAll<SVGGElement, Bar<Data>>('.bar')
      .data();

    this.chartHeader
      .classed('bar-header', true)
      .attr('transform', `translate(${this.marginLeft})`);

    // update header
    const headerUpdate = this.chartHeader.selectAll<SVGGElement, Bar<Data>>('.bar-header__header')
      .data(bars);

    // enter new headers
    const headerEnter = headerUpdate.enter()
      .append<SVGGElement>('g')
        .classed('bar-header__header', true);

    const merged = headerEnter.merge(headerUpdate);

    headerUpdate.exit()
      .transition()
      .remove();

    const id = this.contextualVariable.id,
          isMusicClassroom = id === 'SQ00070',
          isClassromSpace = isMusicClassroom || id === 'SQ00072';

    if (!isClassromSpace) {
      // If we're not a classroom space variable, then we can perform a fairly naive header layout algorithm.
      // For each text node in the header, we position it the same way we would position a bar's label (centered),
      // and then we draw a line from the center of that text element (as determined by the SVG bounding box) to the
      // center of our rectangle (as determined by the Bar<Data> type).
      merged.each(function (bar) {
        const header = select(this);

        const textUpdate = header.selectAll<SVGTextElement, typeof bar>('text')
          .data([bar]);

        textUpdate.interrupt()
          .transition()
            .attr('x', d => d.offset + d.size / 2);

        const textEnter = textUpdate.enter()
          .append<SVGTextElement>('text')
            .classed('bar-header__header-text', true)
            .text(categories[bar.categoryindex])
            .attr('x', d => d.offset + d.size / 2)
            .attr('y', '2em');

        const merged = textEnter.merge(textUpdate),
              textBBox = merged.node().getBBox();

        const x1 = bar.offset + bar.size / 2,
              y1 = textBBox.y + textBBox.height;

        const x2 = bar.offset + bar.size / 2,
              y2 = headerBottom;

        const lineDatum = { x1, y1, x2, y2 };

        const lineUpdate = header.selectAll('line')
          .data([lineDatum]);

        lineUpdate.enter()
          .append('line')
          .classed('bar-header__header-line', true)
          .attr('x1', d => d.x1)
          .attr('y1', d => d.y1)
          .attr('x2', d => d.x2)
          .attr('y2', d => d.y2);

        lineUpdate.interrupt()
          .transition()
          .attr('x1', d => d.x1)
          .attr('y1', d => d.y1)
          .attr('x2', d => d.x2)
          .attr('y2', d => d.y2);
      });

      // All code after this point is related only to the SQ****** contextual variables.
      return;
    }

    const defaultWidth = this.innerWidth / categories.length;

    // Step 1: Append each child element, and wrap by up to `width' units.
    merged.each(function (bar, index) {
      const header = select(this);

      header.append<SVGTextElement>('text')
        .classed('bar-header__header-text', true)
        .text(categories[bar.categoryindex])
        .attr('x', defaultWidth * (index + 0.5))
        .attr('y', '1em')
        .call(wrap, defaultWidth);
    });

    let width = this.innerWidth;

    const header = this.chartHeader.node(),
          headers: SVGElement[] = Array.prototype.slice.call(header.childNodes),
          count = headers.length;

    // Step 2: Move the last two categories as far to the right as possible
    selectAll([headers[count - 1], headers[count - 2]])
      .select<SVGTextElement>('text')
      .each(function () {
        const bbox = this.getBBox(),
              elt = select(this),
              x = +elt.attr('x'),
              // This is the number of pixels left between the end of this bounding box and the remaining width of the
              // header.
              offset = width - (bbox.x + bbox.width);

        // Please note the ordering relationship here: we can manipulate the width
        width -= bbox.width;

        elt.attr('x', x + offset)
          .selectAll('tspan')
          .attr('x', x + offset);

        // Breathing room!
        width -= 5;
      });

    // Step 3: Move the first category as far to the left as possible
    select(headers[0])
      .select<SVGTextElement>('text')
      .each(function () {
        const bbox = this.getBBox(),
              elt = select(this),
              x = (+elt.attr('x')) - bbox.x;

        width -= bbox.width;

        elt.attr('x', x)
          .selectAll('tspan')
          .attr('x', x);

        // Breathing room
        width -= 5;
      });

    // Yikes. Here's the really ugly part of this code.
    //
    // Once we get down here, we've got three category labels left. These labels are stupidly hard to position
    // correctly, so instead of finding some useful automated solution, we'll call this good enough. There are some
    // hard-coded proportions based on the variable. We'll chop up the remaning width (in the variable `width') and
    // hand it out based on the value of the `widths' array. We'll center the text using the `positions' array.
    //
    // The ratios are as follows:
    // Music - 1:1:1
    // Visual Arts - 1:2:1

    const remainingNodes = headers.slice(1, -2);

    // The widths to use
    const widths = isMusicClassroom
                 ? [ width / 3, width / 3, width / 3 ]
                 : [ width / 4, width / 2, width / 4 ];

    // The position of the text's x-value. Centered in the middle of the width we're given.
    const positions = isMusicClassroom
                    ? [ width * 1 / 6, width * 1 / 2, width * 5 / 6 ]
                    : [ width * 1 / 8, width * 1 / 2, width * 7 / 8 ];

    const start = (header.firstElementChild as SVGTextElement).getBBox().width + 5;

    selectAll<SVGElement, Bar<Data>>(remainingNodes)
      .select<SVGTextElement>('text')
      .attr('x', (_, i) => start + positions[i])
      .each(function (d, i) {
        this.textContent = categories[d.categoryindex];

        select(this)
          .call(wrap, widths[i]);
      });

    selectAll<SVGElement, Bar<Data>>(headers)
      .each(function (bar) {
        const elt = select(this),
              text = elt.select<SVGTextElement>('text'),
              bbox = text.node().getBBox();

        const x1 = bbox.x + bbox.width / 2,
              y1 = bbox.y + bbox.height;

        const x2 = bar.offset + bar.size / 2,
              y2 = headerBottom;

        elt.append('line')
          .classed('bar-header__header-line', true)
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2);
      });
  }
}
