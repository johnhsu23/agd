import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';
import TextLegend from 'legends/models/text';

@configure({
  className: 'legend__item',
})
export default class TextLegendView extends ItemView<TextLegend> {
  template = (model: TextLegend) => `<p class="legend__marker legend__marker--text">${model.marker}</p>
<p class="legend__description">${model.description}</p>`;
}
