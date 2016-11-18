import {ItemView} from 'backbone.marionette';
import {Model, EventsHash, history, View} from 'backbone';
import * as $ from 'jquery';
import {bindAll} from 'underscore';

import configure from 'util/configure';

import * as template from 'text!templates/in-page-nav.html';

@configure({
  className: 'in-page-nav',
})
export default class InPageNav extends ItemView<Model> {
  template = () => template;

  events(): EventsHash {
    return {
      'click a': 'visitAnchor',
    };
  }

  onRender(): void {
    const list = this.$('.in-page-nav__list'),
          frag = history.getFragment();

    $('.section').each(function () {
      const $this = $(this),
            title = $this.find('.section__title').text(),
            anchor = $this.attr('id');

      const link = $('<a>', {
        href: `#/${frag}?section=${anchor}`,
        'data-anchor': anchor,
      });

      link.text(title);

      $('<li>')
        .append(link)
        .appendTo(list);
    });

    this.onScroll();
  }

  initialize(): void {
    bindAll(this, 'onScroll');
  }

  protected visitAnchor(event: JQueryEventObject): void {
    event.preventDefault();

    const anchor = $(event.target).data('anchor'),
          position = $('#' + anchor).offset().top;

    $(window).scrollTop(position);
  }

  protected onScroll(): void {
    const scrolled_top_val = $(document).scrollTop(),
        header_pos = $('#main').offset().top,
        top_gt = scrolled_top_val > (header_pos - 20),
        width = $(window).width();

    let offset: number;

    if (width > 1024) {
      offset = (width - 1024) / 2;
    } else {
      offset = (width - 728) / 2;
    }

    this.$('.in-page-nav__inner')
      .toggleClass('nav-fixed', top_gt)
      .css('right', top_gt ? offset : '');
  }

  delegateEvents(): void {
    super.delegateEvents();
    $(window).on('scroll.in-page-nav', this.onScroll);
  }

  undelegateEvents(): void {
    $(window).off('scroll.in-page-nav');
    super.undelegateEvents();
  }

  remove(): View<Model> {
    this.undelegateEvents();
    return super.remove();
  }
}
