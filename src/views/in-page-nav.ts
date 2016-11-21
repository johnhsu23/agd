import {ItemView} from 'backbone.marionette';
import {Model, EventsHash, history} from 'backbone';
import * as $ from 'jquery';

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

  protected visitAnchor(event: JQueryEventObject): void {
    event.preventDefault();

    const anchor = $(event.target).data('anchor'),
          position = $('#' + anchor).offset().top;

    $(window).scrollTop(position);
  }

  protected onScroll(): void {
    const scrollTop = $(document).scrollTop(),
          mainTop = $('#main').offset().top,
          isBelowMain = scrollTop > (mainTop - 20);

    const width = $(window).width(),
          breakpoint = width >= 1024 ? 1024 : 768,
          offset = (width - breakpoint) / 2;

    this.$('.in-page-nav__inner')
      .toggleClass('nav-fixed', isBelowMain)
      .css('right', isBelowMain ? offset : '');
  }

  delegateEvents(): this {
    super.delegateEvents();
    $(window).on('scroll.in-page-nav', () => this.onScroll);
    return this;
  }

  undelegateEvents(): this {
    $(window).off('scroll.in-page-nav');
    return super.undelegateEvents();
  }
}
