import {ViewOptions, EventsHash} from 'backbone';
import {ItemView} from 'backbone.marionette';
import {defer} from 'underscore';
import * as $ from 'jquery';

import configure from 'util/configure';
import * as location from 'util/location';
import ShareModel from 'models/share';
import shareFacebook from 'util/facebook';
import shareTwitter from 'util/twitter';

import * as template from 'text!templates/share.html';

export interface ShareViewOptions extends ViewOptions<ShareModel> {
  model: ShareModel;
}

@configure({
  className: 'share',
  triggers: {
    'click [data-download]': 'share:download',
  } as EventsHash,
})
export class ShareView extends ItemView<ShareModel> {
  template = () => template;

  protected permalink: string;
  protected message: string;

  events(): EventsHash {
    return {
      'click [data-expand]': 'expandDrawer',
      'click [data-facebook]': 'shareFacebook',
      'click [data-twitter]': 'shareTwitter',
      'click [data-email]': 'shareEmail',
      'click [data-link]': 'sharePermalink',
    };
  }

  constructor(options: ShareViewOptions) {
    super(options);

    if (options.model.message != null) {
      this.message = options.model.message;
    } else {
      this.message = document.title;
    }

    this.computePermalink(options.model.section, options.model.accordion);
  }

  onRender(): void {
    this.$('[data-download]')
      .toggleClass('is-hidden', !this.model.download);
    this.$('[type=text]')
      .val(this.permalink);
  }

  protected computePermalink(section: string, accordion: string): void {
    const loc = location.get();
    let permalink = [
      window.location.protocol,
      '//',
      window.location.host,
      window.location.pathname,
      '#',
    ].join('');

    // Adjust for home page. We'll use "overview" since that menu has that set
    // as a data attribute.
    if (loc.path === '') {
      loc.path = 'overview';
    }

    if (section !== undefined) {
      loc.query['anchor'] = section;
    }

    if (accordion !== undefined) {
      loc.query['accordion'] = accordion;
    }

    permalink += location.make(loc);

    this.permalink = permalink;
  }

  protected expandDrawer(event: JQueryMouseEventObject): void {
    event.preventDefault();

    this.$('.share__drawer')
      .slideToggle();
  }

  protected shareFacebook(event: JQueryMouseEventObject): void {
    event.preventDefault();

    shareFacebook({
      u: this.permalink,
      quote: this.message,
    });
  }

  protected shareTwitter(event: JQueryMouseEventObject): void {
    event.preventDefault();

    shareTwitter({
      url: this.permalink,
      text: this.message,
    });
  }

  protected shareEmail(event: JQueryMouseEventObject): void {
    event.preventDefault();

    let subject = this.message || document.title,
        body = this.permalink;

    if (this.message) {
      body = this.message + '\n' + body;
    }

    subject = encodeURIComponent(subject);
    body = encodeURIComponent(body);

    window.location.href = `mailto:?to=&subject=${subject}&body=${body}`;
  }

  protected sharePermalink(event: JQueryMouseEventObject): void {
    event.preventDefault();

    this.$('.share__permalink-popup')
      .show();

    const input = this.$('[type=text]').get(0) as HTMLInputElement;
    input.setSelectionRange(0, this.permalink.length);
    input.focus();

    this.registerDeferredClick();
  }

  protected registerDeferredClick(): void {
    const $body = $(document.body),
        $popup = this.$('.share__permalink-popup'),
        popup = $popup[0];

    // Defer registration: the 'click' event hasn't finish bubbling up to the <body>
    // element yet
    defer(() => {
      $body.on('click.permalink-share', (event: JQueryMouseEventObject) => {
        if (!$.contains(popup, event.target as Element)) {
          $popup.hide();
          $body.off('click.permalink-share');
        }
      });
    });
  }
}

export default ShareView;
