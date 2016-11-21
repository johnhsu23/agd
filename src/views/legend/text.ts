import LegendItemView from 'views/legend/item';
import noTemplate from 'util/no-template';

@noTemplate
export default class LegendTextView extends LegendItemView {
  render(): this {
    super.render();

    const el = this.d3el
      .datum(this.model);

    el.append('p')
      .classed('legend__marker legend__marker--text', true)
      .text(legend => legend.marker);

    el.append('p')
      .classed('legend__description', true)
      .html(legend => legend.description);

    return this;
  }
}
