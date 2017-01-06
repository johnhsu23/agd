import {EventsHash} from 'backbone';
import * as $ from 'jquery';

import Page from 'views/page';
import Overlay from 'views/overlay';
import Glossary from 'views/glossary';

import * as template from 'text!templates/about.html';

export default class AboutView extends Page {
  template = () => template;

  pageTitle = 'About the NAEP Arts Assessment';

  events(): EventsHash {
    return {
      'click [data-glossary]': 'glossary',
    };
  }

  protected glossary(event: JQueryMouseEventObject): void {
    event.preventDefault();

    const target = $(event.target),
      term = target.attr('data-glossary'),
      position = target.offset();

    const overlay = new Overlay;
    overlay.position(position.left, position.top);
    overlay.render();
    overlay.showChildView('contents', new Glossary({term}));

    this.$el.append(overlay.$el);

    if (target.parents('.overlay').length) {
      target.parents('.overlay').remove();
    }
  }
}
