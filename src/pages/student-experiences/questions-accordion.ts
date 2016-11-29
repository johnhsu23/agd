import {ViewOptions, Model} from 'backbone';
import {LayoutView} from 'backbone.marionette';

import {Variable} from 'data/variables';

import Accordion from 'behaviors/accordion';
import configure from 'util/configure';

import * as template from 'text!templates/questions-accordion.html';

export interface QuestionsAccordionOptions extends ViewOptions<Model> {
  variable: Variable;
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

  protected variable: Variable;

  constructor(options: QuestionsAccordionOptions) {
    super(options);

    // NOTE: Using Variable data as dummy info
    this.variable = options.variable;
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    // set the accordion header content (name + bar chart)
    this.$('.accordion__header__text')
      .text(this.variable.name);

    // set chart contents
    this.$('.accordion__contents__bubble')
      .text('Bubble chart section. Nonummy do erat eveniet magnis molestias quia repellat felis duis non. Quisque');

    this.$('.accordion__contents__group')
      .text('Group bar chart section. Fugiat quisque molestiae proident, cupiditate facere! Inceptos consequatur');

    this.$('.accordion__contents__trends')
      .text('Trends bar chart section. Diam semper cumque saepe voluptas corporis arcu, fringilla nemo aliquam?');
  }
}
