import {ViewOptions, Model} from 'backbone';
import {ItemView} from 'backbone.marionette';
import * as $ from 'jquery';

import configure from 'util/configure';
import noTemplate from 'util/no-template';
import {ContextualVariable} from 'data/contextual-variables';

export interface HeatHeaderOptions extends ViewOptions<Model> {
  variableName: string;
  contextualVariable: ContextualVariable;
}

@noTemplate
@configure({
  tagName: 'thead',
})
export default class HeatHeader extends ItemView<Model> {
  protected variableName: string;
  protected contextualVariable: ContextualVariable;

  constructor(options: HeatHeaderOptions) {
    super(options);

    this.variableName = options.variableName;
    this.contextualVariable = options.contextualVariable;
  }

  render(): this {
    super.render();

    const headerRow = $('<tr>');

    $('<th>').text(this.variableName)
      .addClass('variable-label')
      .appendTo(headerRow);

    for (const category of this.contextualVariable.categories) {
      $('<th>').text(category)
        .appendTo(headerRow);
    }

    headerRow.appendTo(this.$el);

    return this;
  }

  updateHeader(variableName: string): void {
    $('.variable-label').text(variableName);
  }
}
