import {ViewOptions, Model} from 'backbone';
import {LayoutView} from 'backbone.marionette';
import {EventsHash} from 'backbone';

import {ContextualVariable} from 'data/contextual-variables';
import Accordion from 'behaviors/accordion';
import configure from 'util/configure';
import {eachView} from 'util/each-region';

import QuestionsHeaderBar from 'pages/student-experiences/questions-header-bar';
import TrendsFigure from 'pages/student-experiences/trends-figure';
import BubbleFigure from 'pages/student-experiences/bubble-figure';
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

  constructor(options: QuestionsAccordionOptions) {
    super(options);

    this.variable = options.variable;
  }

  regions(): {[key: string]: string} {
    return {
      'header-bar': '.accordion__header-bar',
      trends: '.accordion__chart--trends',
      'bubble-chart': '.accordion__chart--bubble',
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

    // set the accordion header content (name + bar chart)
    this.$('.accordion__header-text')
      .text(this.variable.name);

    this.showChildView('header-bar', new QuestionsHeaderBar({
      variable: this.variable,
    }));

    // set chart contents
    this.showChildView('bubble-chart', new BubbleFigure({
      variable: this.variable,
      share: { download: true },
    }));

    this.$('.accordion__chart--group')
      .text('Group bar chart section. Fugiat quisque molestiae proident, cupiditate facere! Inceptos consequatur');

    this.showChildView('trends', new TrendsFigure({
      variable: this.variable,
      share: { download: true },
    }));
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
