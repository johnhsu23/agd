import {View, Model, EventsHash} from 'backbone';
import {select} from 'd3-selection';

import * as template from 'text!templates/figure.html';
import {LayoutView, LayoutViewOptions} from 'backbone.marionette';
import configure from 'util/configure';
import LegendView from 'views/legend';

import ShareView from 'views/share';
import * as share from 'models/share';
import render from 'render/figure';
import exportTable from 'export/table';
import save from 'export/save';

export interface FigureOptions extends LayoutViewOptions<any> {
  share: share.ShareOptions;
  placeholderHeight: number;
}

@configure({
  className: 'figure',
})
export default class FigureView extends LayoutView<any> {
  template = () => template;

  childEvents(): EventsHash {
    return {
      'share:download': 'onShareDownload',
    };
  }

  protected shareModel: share.ShareModel;
  protected placeholderHeight: number;

  onShareDownload(): void {
    const sel = select(this.el);
    const table = sel.select('.table').node();
    if (table) {
      exportTable(sel);
    } else {
      const svg = render(sel);
      save(svg).done();
    }
  }

  constructor(options?: FigureOptions) {
    super(options);

    if (options) {
      if (options.share) {
        this.shareModel = new share.ShareModel(options.share);
      }
      this.placeholderHeight = options.placeholderHeight;
    }
  }

  regions(): { [key: string]: string } {
    return {
      contents: '.figure__contents',
      legend: '.figure__legend',
      controls: '.figure__controls',
      share: '.figure__share',
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

  onRender(): void {
    this.showShare();
    this.setPlaceholderHeight();
  }

  showShare(): void {
    if (this.shareModel) {
      this.showChildView('share', new ShareView({
        model: this.shareModel,
      }));
    }
  }

  showInstructions(instructions: string): void {
    this.$('.figure__instructions')
      .removeClass('is-hidden')
      .html(instructions);
  }

  setPlaceholderHeight(): void {
    if (this.placeholderHeight) {
      this.$('.figure__placeholder').css('height', this.placeholderHeight + 'px');
    }
  }

  removePlaceholder(): void {
    this.$('.figure__placeholder').remove();
  }
}
