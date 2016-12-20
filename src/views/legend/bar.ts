import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';
import BarLegend from 'models/legend/bar';
import * as template from 'text!templates/legend-bar.html';

@configure({
  className: 'legend__item',
})
export default class BarLegendView<Legend extends BarLegend> extends ItemView<Legend> {
  template = () => template;

  render(): this {
    super.render();

    const {category, description} = this.model;

    const classes = [
      'legend__marker',
      'legend__marker--bar',
      `legend__marker--bar-${category}`,
    ];

    this.$('.legend__marker')
      .attr('class', classes.join(' '));

    this.$('.legend__description')
      .html(description);

    return this;
  }
}
