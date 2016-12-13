import {LayoutView, View} from 'backbone.marionette';
import {Model} from 'backbone';

import noTemplate from 'util/no-template';

@noTemplate
export default class QuestionList extends LayoutView<Model> {
  protected count = 0;

  pushView(view: View<Model>): void {
    const count = this.count++,
          region = 'question-' + count;

    const div = document.createElement('div');
    div.setAttribute('data-index', '' + count);
    this.el.appendChild(div);

    this.addRegion(region, `> [data-index=${count}]`);

    this.showChildView(region, view);
  }
}
