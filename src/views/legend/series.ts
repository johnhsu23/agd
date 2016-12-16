import {symbol as makeSymbol} from 'd3-shape';

import configure from 'util/configure';
import D3View from 'views/d3';
import SeriesLegend from 'models/legend/series';

import * as template from 'text!templates/legend-series.html';

const symbol = makeSymbol().size(194);

@configure({
  className: 'legend__item',
})
export default class SeriesLegendView<Legend extends SeriesLegend> extends D3View<HTMLDivElement, Legend> {
  template = () => template;

  render(): this {
    super.render();

    const model = this.model;

    this.d3el.attr('data-tag', model.tag || null);

    this.select('.legend__marker path')
      .attr('d', symbol.type(model.marker)());

    this.select('.legend__description')
      .html(model.description);

    return this;
  }
}
