import {ViewOptions, Model} from 'backbone';
import {LayoutView} from 'backbone.marionette';
import {EventsHash} from 'backbone';

import {ContextualVariable} from 'data/contextual-variables';

import Accordion from 'behaviors/accordion';
import configure from 'util/configure';

import QuestionsHeaderBar from 'pages/student-experiences/questions-header-bar';
import TrendsChart from 'pages/student-experiences/trends-chart';
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
    this.$('.accordion__chart--bubble')
      .text('Bubble chart section. Nonummy do erat eveniet magnis molestias quia repellat felis duis non. Quisque');

    this.$('.accordion__chart--group')
      .text('Group bar chart section. Fugiat quisque molestiae proident, cupiditate facere! Inceptos consequatur');

    this.showChildView('trends', new TrendsChart({
      variable: this.variable,
    }));
  }

  protected chartDisplayToggle(event: JQueryMouseEventObject): void {
    this.$('.accordion__header-bar').toggleClass('is-hidden');

    event.preventDefault();
  }
}
