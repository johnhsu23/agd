import * as $ from 'jquery';
import {Model, EventsHash} from 'backbone';
import {ItemView} from 'backbone.marionette';
import {select} from 'd3-selection';

import configure from 'util/configure';
import * as vars from 'data/variables';

import * as template from 'text!templates/groups-selector.html';

@configure({
  className: 'controls__inner',
})
export default class GroupsSelector extends ItemView<Model> {
  template = () => template;
  protected variable = vars.SDRACE;

  events(): EventsHash {
    return {
      'change select': 'onChange',
    };
  }

  onRender(): void {
    const data: vars.Variable[] = $.map(vars, function(value, index) {
      return value;
    });

    const selector = this.$('select').selectability();
    select(selector[0])
      .selectAll('option')
      .data(data)
      .enter()
      .append<HTMLOptionElement>('option')
      .property('value', d => d.id)
      .property('checked', (d, i) => i === 0)
      .text(d => d.name);

    selector.val(data[0].id).trigger('change');
  }

  protected onChange(event: SelectabilityEvent): void {
    if (!event.selectability) {
      return;
    }

    const variable = vars.studentGroupsById[event.val];

    if (variable !== this.variable) {
      this.variable = variable;
      this.changed();
    }
  }

  protected changed(): void {
    this.triggerMethod('group:select', this.variable);
  }
}
