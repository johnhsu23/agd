import {ViewOptions, Model} from 'backbone';
import {LayoutView} from 'backbone.marionette';
import {EventsHash} from 'backbone';

import {ContextualVariable} from 'data/contextual-variables';
import Accordion from 'behaviors/accordion';
import configure from 'util/configure';
import {eachView} from 'util/each-region';

import QuestionHeaderBar from 'views/question-header-bar';
import {load} from 'pages/opportunities-and-access/questions-header-data';
import TrendsFigure from 'pages/opportunities-and-access/trends-figure';
import BubbleFigure from 'pages/opportunities-and-access/bubble-figure';
import GroupFigure from 'pages/opportunities-and-access/group-figure';
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

    // set header bar chart
    this.showChildView('header-bar', this.headerChart);

    // set the accordion header text
    this.$('.accordion__header-text')
      .text(this.variable.name);

    // set chart contents
    this.showChildView('bubble-chart', new BubbleFigure({
      variable: this.variable,
      share: { download: true },
    }));

    this.showChildView('group-chart', new GroupFigure({
      contextualVariable: this.variable,
      share: { download: true },
    }));

    this.showChildView('trends', new TrendsFigure({
      variable: this.variable,
      share: { download: true },
    }));

    // get the question data and update the chart contents
    load(this.variable)
      .then(data => {
        // for BM00010, use a custom value, 31, for our category (At least once or twice a month)
        const value = (this.variable.id === 'BM00010') ? 31 : data[0].targetvalue;
        return this.headerChart.updateChart(value, this.variable.selectedLabel);
      })
      .done();
  }

  protected chartDisplayToggle(event: JQueryMouseEventObject): void {
    this.$('.accordion__header-bar').toggleClass('is-hidden');

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
  }

  protected onAccordionClose(): void {
    // Notify all children that the interior contents will soon be invisible.
    this.triggerAll('visibility:visible');
  }
}
