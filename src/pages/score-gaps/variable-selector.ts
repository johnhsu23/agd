  import {Model, EventsHash} from 'backbone';
import {select} from 'd3-selection';

import D3View from 'views/d3';
import * as vars from 'data/variables';
import configure from 'util/configure';

import * as template from 'text!templates/variable-selector.html';

interface VariableSelectorOptions {
  variables?: vars.Variable[];
}

@configure({
  className: 'variable-selector',
})
export default class VariableSelector extends D3View<HTMLDivElement, Model> {
  template = () => template;
  protected variables = vars.studentGroups;

  constructor(options?: VariableSelectorOptions) {
    super(options);

    if (options && options.variables) {
      this.variables = options.variables;
    }
  }

  events(): EventsHash {
    return {
      'change select[data-variable]': 'onVariableChange',
    };
  }

  render(): this {
    super.render();

    const selector = this.$('select').selectability();

    select(selector[0])
      .selectAll('option')
      .data(this.variables)
      .enter()
      .append<HTMLOptionElement>('option')
      .property('checked', d => d === vars.SDRACE)
      .property('value', d => d.id)
      .text(d => d.name);

    selector.trigger('change');

    return this;
  }

  protected onVariableChange(event: SelectabilityEvent): void {
    if (!event.selectability) {
      return;
    }

    this.triggerMethod('variable:select', vars.studentGroupsById[event.val]);
  }
}
