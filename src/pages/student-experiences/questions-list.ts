import {Model} from 'backbone';
import {LayoutView} from 'backbone.marionette';
import QuestionsAccordion from 'pages/student-experiences/questions-accordion';
import * as vars from 'data/variables';
import * as template from 'text!templates/questions-list.html';

// NOTE: Using Variable data as dummy info
const variables = [
  vars.SDRACE,
  vars.GENDER,
  vars.SCHTYP1,
];

export default class QuestionsListView extends LayoutView<Model> {
  template = () => template;

  protected count = 0;

  onRender(): void {
    // TODO: separate out accordion creation by Student/School response sections
    for (const variable of variables) {
      const div = document.createElement('div');
      div.setAttribute('data-index', '' + this.count);
      this.el.append(div);

      this.addRegion(variable.id, `> [data-index=${this.count}]`);

      this.showChildView(variable.id, new QuestionsAccordion({
        variable: variable,
      }));

      this.count++;
    }
  }
}
