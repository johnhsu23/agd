import {Model, ViewOptions} from 'backbone';
import {ItemView} from 'backbone.marionette';
import noTemplate from 'util/no-template';
import configure from 'util/configure';

interface HeaderOptions extends ViewOptions<Model> {
  labels: string[];
}

@noTemplate
@configure({
  tagName: 'tr',
})
export default class DefaultHeader extends ItemView<Model> {
  protected labels: string[];

  constructor(options: HeaderOptions) {
    super(options);

    this.labels = options.labels;
  }

  render(): this {
    super.render();

    this.$el.empty();
    for (const label of this.labels) {
      $('<th>', { scope: 'col' })
        .text(label)
        .appendTo(this.$el);
    }

    return this;
  }
}
