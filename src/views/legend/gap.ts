import {symbol as makeSymbol, symbolCircle} from 'd3-shape';

import configure from 'util/configure';
import {gapDiamond} from 'components/symbol';
import D3View from 'views/d3';
import GapLegend from 'models/legend/gap';

import * as template from 'text!templates/legend-gap.html';

const symbol = makeSymbol()
  .size(700);

@configure({
  className: 'legend__item',
})
export default class GapLegendView<Legend extends GapLegend> extends D3View<HTMLDivElement, Legend> {
  template = () => template;

  render(): this {
    super.render();

    const significant = this.model.significant,
          type = significant ? symbolCircle : gapDiamond,
          description = significant ? 'Significant difference' : 'Not significant difference';

    this.select('.legend__marker')
      .classed('legend__marker--gap-significant', significant)
      .classed('legend__marker--gap-not-significant', !significant)
      .select('path')
      .attr('d', symbol.type(type)());

    this.select('.legend__description')
      .text(description);

    return this;
  }
}
