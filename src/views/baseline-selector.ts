import {EventsHash} from 'backbone';
import {uniqueId} from 'underscore';
import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';

import * as template from 'text!templates/baseline-selector.html';

@configure({
  className: 'selector selector--baseline',
})
export default class BaselineSelector extends ItemView<any> {
  template = () => template;

  protected prefix: string;

  render(): this {
    super.render();

    if (!this.prefix) {
      this.prefix = uniqueId('baseline');
      this.$('input')
        .attr('name', this.prefix)
        .each((i, elt) => {
          elt.id = this.prefix + '-' + i;
        });
    }

    return this;
  }

  events(): EventsHash {
    return {
      'change input[type=radio]': 'switchBaseline',
    };
  }

  protected switchBaseline(): void {
    const baseline = this.$('input[type=radio]:checked').val();

    this.triggerMethod('baseline:set', baseline);
  }
}
