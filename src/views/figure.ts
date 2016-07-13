import {LayoutView} from 'backbone.marionette';
import noTemplate from 'util/no-template';

@noTemplate
export default class FigureView extends LayoutView<any> {
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
