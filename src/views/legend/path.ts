import LegendItemView from 'views/legend/item';
import noTemplate from 'util/no-template';

@noTemplate
export default class LegendPathView extends LegendItemView {
  render(): this {
    super.render();

    const el = this.d3el
      .datum(this.model);

    el.append('svg')
      .classed(`legend__marker legend__marker--${this.model.type}`, true)
      .attr('viewBox', '0 0 30 30')
      .append('path')
      .attr('d', legend => legend.marker)
      .attr('transform', 'translate(15, 15)');

    el.append('p')
      .classed('legend__description', true)
      .html(legend => legend.description);

    return this;
  }
}
