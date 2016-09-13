import {Model} from 'backbone';
import {View, LayoutView, Region} from 'backbone.marionette';

import * as template from 'text!templates/page.html';

export default class PageView extends LayoutView<any> {
  template = () => template;

  protected count = 1;

  popSection(): void {
    if (this.count > 1) {
      const count = this.count - 1;
      this.removeRegion('section-' + count);
    }
  }

  pushSection<TModel extends Model>(view?: View<Model>): Region {
    const name = 'section-' + this.count;
    this.count++;

    const elt = document.createElement('div');
    elt.id = name;
    elt.setAttribute('class', 'section');

    this.$('.main__inner')
      .append(elt);

    const region = this.addRegion(name, {
      selector: '#' + name,
    });

    if (view) {
      this.showChildView(name, view);
    }

    return region;
  }
}
