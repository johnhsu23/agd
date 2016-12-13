import {Model} from 'backbone';
import {View, LayoutView, Region} from 'backbone.marionette';
import InPageNav from 'views/in-page-nav';

import * as template from 'text!templates/page.html';

import context from 'models/context';

abstract class PageView extends LayoutView<any> {
  template = () => template;

  abstract pageTitle: string;
  protected count = 1;

  regions(): { [key: string]: string } {
    return {
      'in-page-nav': '.main__header__outer',
      footer: '.main__footer',
    };
  }

  popSection(): void {
    if (this.count > 1) {
      const count = this.count - 1;
      this.removeRegion('section-' + count);
    }
  }

  pushSection<TModel extends Model>(view?: View<TModel>): Region {
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

  onAttach(): void {
    if (context.subject) {
      this.showChildView('in-page-nav', new InPageNav);
    }
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    // place page title in appropriate div
    this.$('.main__header__inner h2')
      .text(this.pageTitle);
  }
}

export default PageView;
