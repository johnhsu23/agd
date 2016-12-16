import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';
import TextLegend from 'models/legend/text';

import * as template from 'text!templates/legend-text.html';

@configure({
  className: 'legend__item',
})
export default class TextLegendView<Legend extends TextLegend> extends ItemView<Legend> {
  template = () => template;

  render(): this {
    super.render();

    const {marker, description} = this.model;

    this.$('.legend__marker')
      .text(marker);

    this.$('.legend__description')
      .html(description);

    return this;
  }
}
