import D3View from 'views/d3';
import Legend from 'legends/model';
import configure from 'util/configure';

@configure({
  className: 'legend__item',
})
abstract class LegendItemView extends D3View<HTMLDivElement, Legend> {
  render(): this {
    super.render();

    this.d3el.attr('data-tag', this.model.tag || null);

    return this;
  }
}

export default LegendItemView;
