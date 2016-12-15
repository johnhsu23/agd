import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';
import TextLegend from 'models/legend/text';

@configure({
  className: 'legend__item',
})
export default class TextLegendView<Legend extends TextLegend> extends ItemView<Legend> {
  template = (model: TextLegend) => `<p class="legend__marker legend__marker--text">${model.marker}</p>
<p class="legend__description">${model.description}</p>`;
}
