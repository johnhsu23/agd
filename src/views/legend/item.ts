import D3View from 'views/d3';
import Legend from 'legends/model';

abstract class LegendItemView extends D3View<HTMLDivElement, Legend> {
  render(): this {
    super.render();

    const model = this.model,
          isNote = model.type === 'note';

    this.d3el
      .attr('data-tag', model.tag || null)
      .attr('class', null)
      .classed('legend__note', isNote)
      .classed('legend__item', !isNote);

    return this;
  }
}

export default LegendItemView;
