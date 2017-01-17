import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';
import HeatLegend from 'models/legend/heat';
import * as template from 'text!templates/legend-heat.html';

@configure({
  className: 'legend__item',
})
export default class HeatLegendView<Legend extends HeatLegend> extends ItemView<Legend> {
  template = () => template;

  render(): this {
    super.render();

    const {category, description} = this.model;

    const classes = [
      'legend__marker',
      'legend__marker--heat',
      `legend__marker--heat-${category}`,
    ];

    this.$('.legend__marker')
      .attr('class', classes.join(' '));

    this.$('.legend__description')
      .html(description);

    return this;
  }
}
