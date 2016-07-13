import noTemplate from 'util/no-template';
import {LayoutView} from 'backbone.marionette';

@noTemplate
export default class PageView extends LayoutView<any> {
  protected count = 1;

  popSection(): void {
    if (this.count > 1) {
      const count = this.count - 1;
      this.removeRegion('section-' + count);
    }
  }

  pushSection(): void {
    const name = 'section-' + this.count;

    const elt = document.createElement('div');
    elt.id = name;

    this.$('.main__inner')
      .append(elt);

    this.addRegion(name, {
      selector: '#' + name,
    });

    this.count++;
  }
}
