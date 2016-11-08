import {ItemView} from 'backbone.marionette';
import {Model, EventsHash} from 'backbone';

import * as template from 'text!templates/header.html';

export default class SiteHeader extends ItemView<Model> {
  template = () => template;

  events(): EventsHash {
    return {
      'click [data-print]': 'openPrint',
    };
  }

  protected openPrint(event: JQueryMouseEventObject): void {
    event.preventDefault();
    window.print();
  }
}
