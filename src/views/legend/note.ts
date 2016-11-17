import LegendItemView from 'views/legend/item';
import noTemplate from 'util/no-template';

@noTemplate
export default class LegendNoteView extends LegendItemView {
  render(): this {
    super.render();

    this.$el.html(this.model.description);

    return this;
  }
}
