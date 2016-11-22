import {Model, EventsHash} from 'backbone';
import {select} from 'd3-selection';

import D3View from 'views/d3';
import * as vars from 'data/variables';
import configure from 'util/configure';

import * as template from 'text!templates/variable-selector.html';

@configure({
  className: 'variable-selector',
})
export default class VariableSelector extends D3View<HTMLDivElement, Model> {
  protected variable = vars.SDRACE;

  template = () => template;

  events(): EventsHash {
    return {
      'change select[data-variable]': 'onVariableChange',
    };
  }

  render(): this {
    super.render();

    const selects = this.$('select').selectability();

    /*
     * Structure of focal category selector:
     *
     * - select
     *   - option[value = SDRACE] Race/ethnicity
     *   - option[value = GENDER] Gender
     *     ...
     */
    select(selects[0])
      .selectAll('option')
      .data(vars.VariableArray)
      .enter()
      .append<HTMLOptionElement>('option')
      // Default focal category is Male under SDRACE
      .property('checked', d => d === vars.SDRACE)
      // The value attribute isn't actually used, but putting something
      // here makes it easier to debug the output in the browser.
      .property('value', d => d.id)
      .text(d => d.name);

    selects.trigger('change');

    return this;
  }

  protected onVariableChange(event: SelectabilityEvent): void {
    if (!event.selectability) {
      return;
    }

    this.variable = vars.VariableList[event.val];
    this.changed();
  }

  protected changed(): void {
    this.triggerMethod('variable:select', this.variable);
  }
}
