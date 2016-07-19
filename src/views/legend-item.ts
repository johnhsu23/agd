import D3View from 'views/d3';
import noTemplate from 'util/no-template';

import Legend from 'legends/model';

@noTemplate
export default class LegendItemView extends D3View<Legend> {
  render(): this {
    const model = this.model;

    this.$el.empty();

    const type = model.type,
          isNote = type === 'note';
    this.d3el
      .attr('data-tag', model.tag || null)
      .attr('class', null)
      .classed({
        legend__note: isNote,
        legend__item: !isNote,
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

  protected renderNote(): void {
    this.d3el
      .datum(this.model)
      .html(legend => legend.description);
  }

  protected renderText(): void {
    const el = this.d3el
      .datum(this.model);

    el.append('p')
      .classed('legend__marker legend__marker--text', true)
      .text(legend => legend.marker);

    el.append('p')
      .classed('legend__description', true)
      .html(legend => legend.description);
  }

  protected renderPath(): void {
    const el = this.d3el
      .datum(this.model);

    el.append('svg')
      .classed('legend__marker legend__marker--path', true)
      .attr('viewBox', '0 0 30 30')
      .append('path')
      .attr('d', legend => legend.marker)
      .attr('transform', 'translate(15, 15)');

    el.append('p')
      .classed('legend__description', true)
      .html(legend => legend.description);
  }
}
