import {ItemView} from 'backbone.marionette';

import noTemplate from 'util/no-template';
import configure from 'util/configure';
import NoteLegend from 'models/legend/note';

@noTemplate
@configure({
  className: 'legend__note',
})
export default class NoteLegendView<Legend extends NoteLegend> extends ItemView<Legend> {
  render(): this {
    super.render();

    this.$el.html(this.model.description);

    return this;
  }
}
