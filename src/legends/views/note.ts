import {ItemView} from 'backbone.marionette';

import noTemplate from 'util/no-template';
import configure from 'util/configure';
import NoteLegend from 'legends/models/note';

@noTemplate
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
