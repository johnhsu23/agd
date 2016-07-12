import D3View from 'views/d3';
import configure from 'util/configure';

import Legend from 'legends/model';

@configure({
  template: false,
})
export default class LegendItemView extends D3View<Legend> {
  render() {
    const model = this.model;

    this.$el.empty();

    const type = model.type;
    this.d3el
      .attr('data-tag', model.tag || null)
      .attr('class', null)
      .classed({
        'legend__note': type === 'note',
        'legend__item legend__item--text': type === 'text',
        'legend__item legend__item--path': type === 'path',
       });

    switch (type) {
      case 'note':
        this.renderNote();
        break;

      case 'text':
        this.renderText();
        break;

      case 'path':
        this.renderPath();
    }

    return this;
  }

  protected renderNote() {
    this.d3el
      .datum(this.model)
      .html(legend => legend.description);
  }

  protected renderText() {
    const el = this.d3el
      .datum(this.model);

    el.append('p')
      .classed('legend__marker legend__marker-text', true)
      .text(legend => legend.marker);

    el.append('p')
      .classed('legend__description', true)
      .html(legend => legend.description);
  }

  protected renderPath() {
    const el = this.d3el
      .datum(this.model);

    el.append('svg')
      .classed('legend__marker legend__marker-path', true)
      .attr('viewBox', '0 0 30 30')
      .append('path')
      .attr('d', legend => legend.marker)
      .attr('transform', 'translate(15, 15)');

    el.append('p')
      .classed('legend__description', true)
      .html(legend => legend.description);
  }
}
