import {radio} from 'backbone.wreqr';
import {ItemView} from 'backbone.marionette';
import {Model, ViewOptions} from 'backbone';

import * as template from 'text!templates/secondary-nav.html';

export interface SecondaryNavOptions extends ViewOptions<any> {
  subject?: string;
}

export default class SecondaryNav extends ItemView<Model> {
  template = () => template;

  delegateEvents(): this {
    super.delegateEvents();

    const {vent} = radio.channel('secondary-nav');
    this.listenTo(vent, 'secondary-nav', this.updateLinks);

    return this;
  }

  updateLinks(subject?: string): void {
    if (subject) {
      $(this.el).show();

      const subjectRe = /^#\/(music|visual-arts)/;

      this.$('a').each((i, elem) => {
        const $elem = $(elem);
        let href = $elem.attr('href');

        if (subjectRe.test(href)) {
          const subjectInString = subjectRe.exec(href)[0];
          href = href.slice(subjectInString.length);
        }

        href = '#/' + subject + href;
        $elem.attr('href', href);
      });
    } else {
      $(this.el).hide();
    }
  }
}
