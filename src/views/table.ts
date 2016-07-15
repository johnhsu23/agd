import {Model} from 'backbone';
import {CompositeView, View, CollectionViewOptions} from 'backbone.marionette';
import * as template from 'text!templates/table.html';
import configure from 'util/configure';

interface TableViewOptions<Row extends Model> extends CollectionViewOptions<Row> {
  headerClass?: typeof View;
  header?: View<Model>;
  footerClass?: typeof View;
}

@configure({
  tagName: 'table',
  className: 'table',
  childViewContainer: 'tbody',
})
export default class TableView<Row extends Model, RowView extends View<Row>> extends CompositeView<Row, RowView> {
  template = () => template;
  childViewContainer: string;

  protected header: View<Model>;

  constructor(options?: TableViewOptions<Row>) {
    super(options);

    if (options.header) {
      this.header = options.header;
    } else if (options.headerClass) {
      this.header = new options.headerClass;
    }
  }

  render(): this {
    super.render();

    if (this.header) {
      this.$('thead')
        .append(this.header.$el);

      this.header.render();
    }

    return this;
  }
}
