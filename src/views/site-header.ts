import {radio} from 'backbone.wreqr';
import {ItemView} from 'backbone.marionette';
import {Model, EventsHash} from 'backbone';

import * as template from 'text!templates/header.html';

export default class SiteHeader extends ItemView<Model> {
  template = () => template;

  delegateEvents(): this {
    super.delegateEvents();

    const {vent} = radio.channel('page');

    this.listenTo(vent, 'page', this.onPageChanged);

    return this;
  }

  events(): EventsHash {
    return {
      'click [data-print]': 'openPrint',
    };
  }

  protected openPrint(event: JQueryMouseEventObject): void {
    event.preventDefault();
    window.print();
  }

  protected onPageChanged(page: string, subject?: 'music' | 'visual arts'): void {
    // We use the raw paths instead of relying on the `context' model because we have to distinguish between the
    // home and about pages, which `context' doesn't do.
    const isHomepage = page === 'pages/homepage',
          isAbout = page === 'pages/about',
          isNonSubject = isAbout || isHomepage;

    this.$('.js-link-homepage')
      .toggleClass('is-active', isHomepage);

    this.$('.js-link-music')
      .toggleClass('is-active', subject === 'music' && !isNonSubject);

    this.$('.js-link-visual-arts')
      .toggleClass('is-active', subject === 'visual arts' && !isNonSubject);

    this.$('.js-link-about')
      .toggleClass('is-active', isAbout);
  }
}
