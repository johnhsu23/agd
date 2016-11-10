import {ItemView} from 'backbone.marionette';
import {Model, EventsHash} from 'backbone';

import getPath from 'util/get-path';

import * as template from 'text!templates/in-page-nav.html';

export default class InPageNav extends ItemView<Model> {
  template = () => template;

  protected sections(): JQuery {
    return $('div.section');
  }

  protected getTitle(element: Element): string {
    return $(element).find('div.section__title').text();
  }

  events(): EventsHash {
    return {
      'click a.pageLink': 'visitAnchor',
    };
  }

  onRender(): void {
    this.updateLinks();
  }

  updateLinks(): void {
    $('.main__header').after(this.$el.html(template));

    this.sections().each((index, value) => {
      console.log(getPath());
      const title = this.getTitle(value),
            location = getPath().location,
            anchor = '#' + $(value).attr('id'),
            full_anchor = location + anchor,
            element = $('<a>')
              .text(title)
              .attr({
                'class': 'pageLink',
                'href': full_anchor,
                'data-anchor': anchor,
              });
      this.$('.pageNavList').append($('<li>').append(element));
    });
  }

  visitAnchor(event: JQueryEventObject): void {
    event.preventDefault();

    const anchor = $(event.target).data('anchor'),
          position = $(anchor).offset().top;

    $(window).scrollTop(position);
  }
}
