import * as template from 'text!templates/figure.html';
import {LayoutView} from 'backbone.marionette';
import configure from 'util/configure';
import {View, Model} from 'backbone';
import LegendView from 'views/legend';

@configure({
  className: 'figure',
})
export default class FigureView extends LayoutView<any> {
  template = () => template;

  regions(): { [key: string]: string } {
    return {
      'contents': '.figure__contents',
      'legend': '.figure__legend',
      'controls': '.figure__controls',
    };
  }

  setTitle(title: string): void {
    this.$('.figure__title')
      .text(title);
  }

  showContents<M extends Model, V extends View<M>>(view: V): void {
    this.showChildView('contents', view);
  }

  showLegend(view: LegendView): void {
    this.showChildView('legend', view);
  }

  showControls<M extends Model, V extends View<M>>(view: V): void {
    this.showChildView('controls', view);
  }
}
