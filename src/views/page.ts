import {Model, history} from 'backbone';
import {View, LayoutView, Region} from 'backbone.marionette';
import * as $ from 'jquery';

import InPageNav from 'views/in-page-nav';

import * as template from 'text!templates/page.html';

abstract class PageView extends LayoutView<any> {
  template = () => template;

  abstract pageTitle: string;
  protected count = 1;

  regions(): { [key: string]: string } {
    return {
      'in-page-nav': '.in-page-nav-wrapper',
      footer: '.main__footer .inner',
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

    // Indicate styling continuity based on even- or oddness of the number of sections
    this.$('.main__footer')
      .toggleClass('main__footer--gray', (this.count % 2) === 0);

    this.count++;
    return region;
  }

  onAttach(): void {
    // only do for non-home pages. homepage path is '', thus gives a length of 0
    if (history.getFragment().length > 0) {
      this.showChildView('in-page-nav', new InPageNav);
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

  protected scrollToFooter(event: JQueryMouseEventObject): void {
    event.preventDefault();

    const $footer = $('#footer');

    // Move focus to the footer to ensure tab order is still somewhat sane
    $footer.find('.footer-header__link')[0]
      .focus();

    // Move scroll position to the #footer element
    $footer[0].scrollIntoView();
  }

}

export default PageView;
