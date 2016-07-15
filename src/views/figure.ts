import * as template from 'text!templates/figure.html';
import {LayoutView} from 'backbone.marionette';
import configure from 'util/configure';

@configure({
  className: 'figure',
})
export default class FigureView extends LayoutView<any> {
  template = () => template;

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
