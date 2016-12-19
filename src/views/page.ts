import {Model} from 'backbone';
import {View, LayoutView, Region} from 'backbone.marionette';
import * as $ from 'jquery';

import InPageNav from 'views/in-page-nav';
import context from 'models/context';

import * as template from 'text!templates/page.html';

abstract class PageView extends LayoutView<any> {
  template = () => template;

  abstract pageTitle: string;
  protected count = 1;
  anchor?: string;

  regions(): { [key: string]: string } {
    return {
      'in-page-nav': '.in-page-nav-wrapper',
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

      if (this.anchor) {
        this.scrollToAnchor();
      }
    }
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    // place page title
    this.$('.js-page-title')
      .text(this.pageTitle);
  }

  /**
   *  Scroll down to the anchor link (for use after
   *  dynamic loading of elements which can push the
   *  anchor back off the page).
   */
  scrollToAnchor(): void {
    const view = this;

    if (view.anchor.charAt(0) !== '#') {
      view.anchor = '#' + this.anchor;
    }
    const targetPos = $(view.anchor).offset().top;
    $(window).scrollTop(targetPos);
  }
}

export default PageView;
