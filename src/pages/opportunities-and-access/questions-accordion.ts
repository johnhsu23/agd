import {ViewOptions, Model} from 'backbone';
import {LayoutView} from 'backbone.marionette';
import {EventsHash} from 'backbone';

import {ContextualVariable} from 'data/contextual-variables';
import Accordion from 'behaviors/accordion';
import configure from 'util/configure';
import {eachView} from 'util/each-region';
import * as analytics from 'util/analytics';

import QuestionHeaderBar from 'views/question-header-bar';
import {load} from 'pages/opportunities-and-access/questions-header-data';
import TrendsFigure from 'pages/opportunities-and-access/trends-figure';
import BubbleFigure from 'pages/opportunities-and-access/bubble-figure';
import GroupFigure from 'pages/opportunities-and-access/group-figure';
import HeatGroupFigure from 'pages/opportunities-and-access/heat-group-figure';
import HeatTrendsFigure from 'pages/opportunities-and-access/heat-trends-figure';
import * as template from 'text!templates/questions-accordion.html';

export interface QuestionsAccordionOptions extends ViewOptions<Model> {
  variable: ContextualVariable;
}

@configure({
  className: 'accordion',
  behaviors: {
    Accordion: {
      behaviorClass: Accordion,
    },
  },
})
export default class QuestionsAccordion extends LayoutView<Model> {
  template = () => template;

  protected variable: ContextualVariable;
  protected headerChart = new QuestionHeaderBar();

  constructor(options: QuestionsAccordionOptions) {
    super(options);

    this.variable = options.variable;
  }

  regions(): {[key: string]: string} {
    return {
      'header-bar': '.accordion__header-bar',
      'bubble-chart': '.accordion__chart--bubble',
      'group-chart': '.accordion__chart--group',
      trends: '.accordion__chart--trends',
    };
  }

  events(): EventsHash {
    return {
      'click [data-accordion-header]': 'chartDisplayToggle',
    };
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    // set data-naepid using variable id
    this.$el.attr('data-naepid', this.variable.id);

    // change show/hide text for the first accordion
    if (this.$el.attr('data-naepid') === 'BV00003' || this.$el.attr('data-naepid') === 'BM00003') {
      this.$('.accordion__show-hide').text('show response results');
    }

    // set header bar chart
    this.showChildView('header-bar', this.headerChart);

    // set the accordion header text
    this.$('.accordion__header-text')
      .text(this.variable.name);

    // set chart contents
    this.showChildView('bubble-chart', new BubbleFigure({
      variable: this.variable,
      share: {
        download: true,
        section: 'bubble',
        accordion: this.variable.id,
        message: `${this.variable.name}: Scale Scores and Percentages`,
      },
      placeholderHeight: 267,
    }));

    if (this.isHeatTable()) {
      // group and trends chart should use the heat table
      this.showChildView('group-chart', new HeatGroupFigure({
        contextualVariable: this.variable,
        share: {
          download: true,
          section: 'group',
          accordion: this.variable.id,
          message: `${this.variable.name}: Percentages by Student Group`,
        },
        placeholderHeight: 469,
      }));

      this.showChildView('trends', new HeatTrendsFigure({
        contextualVariable: this.variable,
        share: {
          download: true,
          section: 'trends',
          accordion: this.variable.id,
          message: `${this.variable.name}: Percentage Trends`,
        },
        placeholderHeight: 367,
      }));
    } else {
      // group and trends chart should use the regular stacked bar
      this.showChildView('group-chart', new GroupFigure({
        contextualVariable: this.variable,
        share: {
          download: true,
          section: 'group',
          accordion: this.variable.id,
          message: `${this.variable.name}: Percentages by Student Group`,
        },
        placeholderHeight: 380,
      }));

      this.showChildView('trends', new TrendsFigure({
        variable: this.variable,
        share: {
          download: true,
          section: 'trends',
          accordion: this.variable.id,
          message: `${this.variable.name}: Percentage Trends`,
        },
        placeholderHeight: 317,
      }));
    }

    // get the question data and update the chart contents
    load(this.variable)
      .then(data => {
        // for BM00010, sum the categories (At least once or twice a month)
        const value = (this.variable.id === 'BM00010')
            ? data.reduce((a, b) => a + b.targetvalue, 0)
            // for everyone else, we simply need the targetvalue
            : data[0].targetvalue;
        return this.headerChart.updateChart(value, this.variable.selectedLabel);
      })
      .done();
  }

  protected chartDisplayToggle(event: JQueryMouseEventObject): void {
    this.$('.accordion__header-bar').toggleClass('is-hidden');

    // change show/hide text for the first accordion after click event
    if ((this.$el.attr('data-naepid') === 'BV00003' || this.$el.attr('data-naepid') === 'BM00003')
        && !this.$el.hasClass('is-expanded')) {
        this.$('.accordion__show-hide').text('show response results');
    }

    event.preventDefault();
  }

  /**
   * Triggers an event for every child view managed by our region manager.
   */
  protected triggerAll(event: string): void {
    eachView(this, view => {
      view.triggerMethod(event);
    });
  }

  protected onAccordionOpen(): void {
    // Notify all children that the interior contents are visible.
    this.triggerAll('visibility:visible');
    analytics.push('_trackEvent', 'Accordion', 'Accordion Opened', this.variable.id);
  }

  protected onAccordionClose(): void {
    // Notify all children that the interior contents will soon be invisible.
    this.triggerAll('visibility:visible');
  }

  // helper function to see if the chart should be a heat table or not
  protected isHeatTable(): boolean {
    return this.variable.id === 'SQ00070' || this.variable.id === 'SQ00072';
  }
}
