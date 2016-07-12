import {LayoutView} from 'backbone.marionette';

import configure from 'util/configure';

@configure({
  template: false,
})
export default class FigureView extends LayoutView<any> {
  template: boolean;

  regions(): { [key: string]: string } {
    return {
      'inner': '.figure__inner',
      'legend': '.figure__legend',
    };
  }

  setTitle(title: string): void {
    this.$('.figure__title')
      .text(title);
  }
}
