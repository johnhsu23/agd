import {ViewOptions, EventsHash} from 'backbone';
import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';
import ShareModel from 'models/share';

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

  constructor(options: ShareViewOptions) {
    super(options);
  }

  onRender(): void {
    this.$('[data-download]')
      .toggleClass('is-hidden', !this.model.download);
  }
}

export default ShareView;
