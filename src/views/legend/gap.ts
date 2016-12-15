import {symbol as makeSymbol, symbolCircle} from 'd3-shape';

import noTemplate from 'util/no-template';
import configure from 'util/configure';
import {gapDiamond} from 'components/symbol';
import D3View from 'views/d3';
import GapLegend from 'models/legend/gap';

const symbol = makeSymbol()
  .size(700);

@noTemplate
@configure({
  className: 'legend__item',
})
export default class GapLegendView<Legend extends GapLegend> extends D3View<HTMLDivElement, Legend> {
  render(): this {
    const significant = this.model.significant,
          type = significant ? symbolCircle : gapDiamond,
          el = this.d3el;

    el.append('svg')
      .classed('legend__marker legend__marker--gap', true)
      .classed('legend__marker--gap-significant', significant)
      .classed('legend__marker--gap-not-significant', !significant)
      .attr('viewBox', '0 0 40 40')
      .append('path')
      .attr('d', symbol.type(type)())
      .attr('transform', 'translate(20, 20)');

    el.append('p')
      .classed('legend__description', true)
      .html(significant ? 'Significant difference' : 'Not significant difference');

    return this;
  }
}
