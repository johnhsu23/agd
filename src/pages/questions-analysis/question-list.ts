import {LayoutView, View} from 'backbone.marionette';
import {Model} from 'backbone';
import * as $ from 'jquery';
import {radio} from 'backbone.wreqr';

import noTemplate from 'util/no-template';

@noTemplate
export default class QuestionList extends LayoutView<Model> {
  protected count = 0;

  delegateEvents(): this {
    super.delegateEvents();

    const {vent} = radio.channel('naepid');
    this.listenTo(vent, 'show-question', this.goToAccordion);

    return this;
  }

  pushView(view: View<Model>, questionId: string): void {
    const count = this.count++,
          region = 'question-' + count;

    const div = document.createElement('div');
    div.setAttribute('data-index', '' + count);
    div.setAttribute('data-naepid', questionId);
    this.el.appendChild(div);

    this.addRegion(region, `> [data-index=${count}]`);

    this.showChildView(region, view);
  }

  goToAccordion(id: string): void {
    // get the accordion based on the ID
    const accordion = this.$(`[data-naepid="${id}"]`);

    // check if accordion is NOT already expanded
    if (accordion.find('.is-expanded').length === 0) {
      //open the accordion (trigger click on the data-accordion-header anchor)
      accordion.find('[data-accordion-header]').click();
    }

    // have the page scroll to the accordion
    $(window).scrollTop(accordion.offset().top);
  }
}
