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
  }

  protected visitAnchor(event: JQueryEventObject): void {
    event.preventDefault();

    const anchor = $(event.target).data('anchor'),
          position = $('#' + anchor).offset().top;

    $(window).scrollTop(position);
  }
}
