import {ViewOptions, EventsHash} from 'backbone';
import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';
import * as location from 'util/location';
import ShareModel from 'models/share';
import * as facebook from 'util/facebook';

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

    const section = options.model.section;

    if (options.model.message != null) {
      this.message = options.model.message;
    } else {
      this.message = document.title;
    }

    this.computePermalink(section);
  }

  onRender(): void {
    this.$('[data-download]')
      .toggleClass('is-hidden', !this.model.download);
  }

  computePermalink(section: string): void {
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

    loc.section = section;

    permalink += location.make(loc);

    this.permalink = permalink;
  }

  expandDrawer(event: JQueryMouseEventObject): void {
    event.preventDefault();

    this.$('.share__drawer')
      .slideToggle();
  }

  shareFacebook(event: JQueryMouseEventObject): void {
    event.preventDefault();

    const options: facebook.Options = {
      u: this.permalink,
      quote: this.message,
    };

    facebook.share(options);
  }

  shareTwitter(event: JQueryMouseEventObject): void {
    event.preventDefault();

    console.log('Twitter');
  }

  shareEmail(event: JQueryMouseEventObject): void {
    event.preventDefault();

    console.log('Email');
  }

  sharePermalink(event: JQueryMouseEventObject): void {
    event.preventDefault();

    console.log('Permalink');
  }
}

export default ShareView;
