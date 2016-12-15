import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';
import NoteLegend from 'legends/models/note';

@configure({
  className: 'legend__note',
})
export default class NoteLegendView extends ItemView<NoteLegend> {
  render(): this {
    super.render();

    this.$el.html(this.model.description);

    return this;
  }
}
