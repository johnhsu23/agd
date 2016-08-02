import {uniqueId} from 'underscore';
import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';

import * as template from 'text!templates/baseline-switcher.html';

@configure({
  className: 'baseline-switcher',
})
export default class BaselineSwitcher extends ItemView<any> {
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
}
