import {EventsHash} from 'backbone';
import * as $ from 'jquery';

import configure from 'util/configure';
import Page from 'views/page';
import Dialog from 'views/dialog';
import Glossary from 'views/glossary';

import * as template from 'text!templates/about.html';

@configure({
  className: 'about',
})
export default class AboutView extends Page {
  template = () => template;

  pageTitle = 'About the NAEP Arts Assessment';

  events(): EventsHash {
    return {
      'click [data-glossary]': 'glossary',
      'click .js-footer': 'scrollToFooter',
    };
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

  protected glossary(event: JQueryMouseEventObject): void {
    event.preventDefault();

    const target = $(event.target),
      term = target.attr('data-glossary'),
      position = target.offset();

    const dialog = new Dialog;

    // set up our dialog box
    dialog
      .position([position.left, position.top])
      .render();

    // create and insert glossary term
    dialog.$('.dialog__contents')
      .html(new Glossary({term}).render().el);

    // append dialog box to the page
    this.$el.append(dialog.$el);

    if (target.parents('.dialog').length) {
      target.parents('.dialog').remove();
    }
  }
}
