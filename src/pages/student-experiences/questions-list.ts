import {Model} from 'backbone';
import {LayoutView} from 'backbone.marionette';
import QuestionsResponse from 'pages/student-experiences/questions-response';
import * as vars from 'data/variables';
import * as template from 'text!templates/questions-list.html';

// NOTE: Using Variable data as dummy info
const studentVariables = [
  vars.SDRACE,
  vars.GENDER,
  vars.SCHTYP1,
];

const schoolVariables = [
  vars.SLUNCH1,
  vars.PARED,
  vars.IEP,
];

export default class QuestionsListView extends LayoutView<Model> {
  template = () => template;

  regions(): {[key: string]: string} {
    return {
      'student-responses': '#student-responses',
      'school-responses': '#school-responses',
    };
  }

  onRender(): void {
    this.showChildView('student-responses', new QuestionsResponse({
      variables: studentVariables,
      headerText: 'Selected student questionnaire responses:',
    }));
    this.showChildView('school-responses', new QuestionsResponse({
      variables: schoolVariables,
      headerText: 'Selected school questionnaire responses:',
    }));
  }
}
