import {Model} from 'backbone';
import {CompositeView, View, CollectionViewOptions} from 'backbone.marionette';
import * as template from 'text!templates/table.html';
import configure from 'util/configure';

export interface TableViewOptions<Row extends Model> extends CollectionViewOptions<Row> {
  header?: View<Model>;
  headerClass?: typeof View;

  footer?: View<Model>;
  footerClass?: typeof View;
}

@configure({
  tagName: 'table',
  className: 'table',
  childViewContainer: 'tbody',
})
export class TableView<Row extends Model, RowView extends View<Row>> extends CompositeView<Row, RowView> {
  template = () => template;
  childViewContainer: string;

  protected isRendered: boolean;

  protected header: View<Model>;
  protected footer: View<Model>;

  constructor(options?: TableViewOptions<Row>) {
    super(options);
  }

  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    const header = this.getOption('header') as View<Model>,
          headerClass = this.getOption('headerClass') as typeof View,
          thead = this.$('> thead');

    if (header) {
      header.setElement(thead);
      this.header = header;
    } else if (headerClass) {
      this.header = new headerClass({
        el: thead,
      });
    }

    if (this.header) {
      this.header.render();
    }

    const footer = this.getOption('footer') as View<Model>,
          footerClass = this.getOption('footerClass') as typeof View,
          tfoot = this.$('> tfoot');

    if (footer) {
      footer.setElement(tfoot);
      this.footer = footer;
    } else if (footerClass) {
      this.footer = new footerClass({
        el: tfoot,
      });
    }

    if (this.footer) {
      this.footer.render();
    }
  }

  destroy(): this {
    if (this.header) {
      this.header.destroy();
    }

    if (this.footer) {
      this.footer.destroy();
    }

    return super.destroy() as this;
  }
}

export default TableView;
