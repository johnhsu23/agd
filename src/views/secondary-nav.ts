import {radio} from 'backbone.wreqr';
import {ItemView} from 'backbone.marionette';
import {Model} from 'backbone';
import * as $ from 'jquery';

import configure from 'util/configure';
import context from 'models/context';

import * as template from 'text!templates/secondary-nav.html';

@configure({
  className: 'secondary-nav__inner',
})
export default class SecondaryNav extends ItemView<Model> {
  template = () => template;

  delegateEvents(): this {
    super.delegateEvents();

    const {vent} = radio.channel('secondary-nav');
    this.listenTo(vent, 'show', this.showNav);
    this.listenTo(vent, 'hide', this.hideNav);

    return this;
  }

  protected showNav(page: string): void {
    this.$el.removeClass('is-hidden');

    this.$('.secondary-nav__tile a').each(function () {
      const $this = $(this),
            path = $this.data('path');

      $this.attr('href', '#/' + context.subject.replace(' ', '-') + '/' + path)
        .toggleClass('is-active', page === path);
    });
  }

  protected hideNav(): void {
    this.$el.addClass('is-hidden');
  }
}
