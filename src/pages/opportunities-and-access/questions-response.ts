import {ViewOptions, Model} from 'backbone';
import {LayoutView} from 'backbone.marionette';

import {ContextualVariable} from 'data/contextual-variables';

import QuestionsAccordion from 'pages/opportunities-and-access/questions-accordion';
import configure from 'util/configure';

import * as template from 'text!templates/questions-response.html';

export interface QuestionsResponseOptions extends ViewOptions<Model> {
  variables: ContextualVariable[];
  headerText: string;
}

@configure({
  className: 'response',
})
export default class QuestionsResponse extends LayoutView<Model> {
  template = () => template;

  protected variables: ContextualVariable[];
  protected headerText: string;

  protected count = 0;

  constructor(options: QuestionsResponseOptions) {
    super(options);

    this.variables = options.variables;
    this.headerText = options.headerText;
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.$('.response__header')
      .text(this.headerText);

    // add accordions
    for (const variable of this.variables) {
      const div = document.createElement('div');
      div.setAttribute('data-index', '' + this.count);
      this.$('.response__contents').append(div);

      this.addRegion(variable.id, `.response__contents [data-index=${this.count}]`);

      this.showChildView(variable.id, new QuestionsAccordion({
        variable: variable,
      }));

      this.count++;
    }
  }
}
