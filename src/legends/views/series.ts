import {symbol as makeSymbol} from 'd3-shape';

import configure from 'util/configure';
import D3View from 'views/d3';
import SeriesLegend from 'legends/models/series';

const symbol = makeSymbol().size(194);

@configure({
  className: 'legend__item',
})
export default class SeriesLegendView extends D3View<HTMLDivElement, SeriesLegend> {
  render(): this {
    super.render();

    const el = this.el,
          model = this.model;

    el.append('svg')
      .classed('legend__marker legend__marker--path', true)
      .attr('viewBox', '0 0 30 30')
      .append('path')
      .attr('d', symbol.type(model.type)())
      .attr('transform', 'translate(15, 15)');

    el.append('p')
      .classed('legend__description', true)
      .html(model.description);

    return this;
  }
}
