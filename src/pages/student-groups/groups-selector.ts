import {EventsHash} from 'backbone';
import {ItemView} from 'backbone.marionette';
import * as template from 'text!templates/groups-selector.html';
import configure from 'util/configure';
import {select} from 'd3-selection';
import * as vars from 'data/variables';
import * as $ from 'jquery';

export type Option = { [key: string]: string };
export type Options = Option[];

@configure({
  className: 'controls__inner',
})
export default class GroupsSelector extends ItemView<any> {
  template = () => template;
  protected variable = vars.SDRACE;

  events(): EventsHash {
    return {
      'change select': 'onChange',
    };
  }

  regions(): {[key: string]: string} {
    return {
      contents: '.controls__contents',
    };
  }

  setSelection(): void {
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

  onRender(): void {
    this.setSelection();
  }

  protected onChange(event: SelectabilityEvent): void {
    if (!event.selectability) {
      return;
    }

    const options = (event.target as HTMLSelectElement).selectedOptions;
    const variable = select<Element, vars.Variable>(options[0]).datum();
    if (variable !== this.variable) {
      this.variable = variable;
      this.changed();
    }
  }

  protected changed(): void {
    this.triggerMethod('scoreTrends:select', this.variable);
  }
}
