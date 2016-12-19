import {LayoutView} from 'backbone.marionette';
import {Model} from 'backbone';
import context from 'models/context';
import configure from 'util/configure';

import * as musicTemplate from 'text!templates/item-map-music.html';
import * as visualArtsTemplate from 'text!templates/item-map-visual-arts.html';

@configure({
  className: 'item-map',
})
export default class ItemMap extends LayoutView<Model> {
  template = () => (context.subject === 'music') ? musicTemplate : visualArtsTemplate;
}
