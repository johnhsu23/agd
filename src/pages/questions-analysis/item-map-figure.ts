import {LayoutView} from 'backbone.marionette';
import {Model} from 'backbone';
import {EventsHash} from 'backbone';
import {radio} from 'backbone.wreqr';

import context from 'models/context';
import configure from 'util/configure';

import * as musicTemplate from 'text!templates/item-map-music.html';
import * as visualArtsTemplate from 'text!templates/item-map-visual-arts.html';

@configure({
  className: 'item-map',
})
export default class ItemMap extends LayoutView<Model> {
  template = () => (context.subject === 'music') ? musicTemplate : visualArtsTemplate;

  protected vent = radio.channel('naepid').vent;

  events(): EventsHash {
    return {
      'click .item-map__item__link a': 'onItemMapClick',
    };
  }

  onItemMapClick(event: JQueryMouseEventObject): void {
    const naepid = event.target.getAttribute('data-naepid');

    this.vent.trigger('show-question', naepid);

    event.preventDefault();
  }
}
