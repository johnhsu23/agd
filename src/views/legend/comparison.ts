import SeriesLegendView from 'views/legend/series';
import ComparisonLegend from 'models/legend/comparison';

export default class ComparisonLegendView<Legend extends ComparisonLegend> extends SeriesLegendView<Legend> {
  render(): this {
    super.render();

    const isFocal = this.model.type === 'focal';

    this.d3el
      .classed('legend__item--comparison', true)
      .classed('legend__item--focal', isFocal)
      .classed('legend__item--target', !isFocal);

    return this;
  }
}
