import {Model} from 'backbone';
import {LayoutView} from 'backbone.marionette';

import context from 'models/context';

import QuestionsResponse from 'pages/opportunities-and-access/questions-response';

import * as contextualVars from 'data/contextual-variables';
import * as template from 'text!templates/questions-list.html';

const studentVariables: {[k: string]: contextualVars.ContextualVariable[]} = {
  music: [
    contextualVars.BM00003,
    contextualVars.BM00010,
    contextualVars.BM80013,
    contextualVars.BM80015,
    contextualVars.BM80023,
    contextualVars.BM80024,
    contextualVars.BM80030,
    contextualVars.BM80034,
  ],
  'visual arts': [
    contextualVars.BV00003,
    contextualVars.BV00007,
    contextualVars.BV00008,
    contextualVars.BV00019,
    contextualVars.BV80022,
    contextualVars.BV80023,
    contextualVars.BV80024,
    contextualVars.BV80032,
  ],
};

const schoolVariables: {[k: string]: contextualVars.ContextualVariable[]} = {
  music: [
    contextualVars.SQ00701,
    contextualVars.SQ00202,
    contextualVars.SQ00070,
  ],
  'visual arts': [
    contextualVars.SQ00901,
    contextualVars.SQ00204,
    contextualVars.SQ00072,
  ],
};

export default class QuestionsListView extends LayoutView<Model> {
  template = () => template;

  regions(): {[key: string]: string} {
    return {
      'student-responses': '.js-student-responses',
      'school-responses': '.js-school-responses',
    };
  }

  onRender(): void {
    this.showChildView('student-responses', new QuestionsResponse({
      variables: studentVariables[context.subject],
      headerText: 'Selected student questionnaire responses:',
    }));
    this.showChildView('school-responses', new QuestionsResponse({
      variables: schoolVariables[context.subject],
      headerText: 'Selected school questionnaire responses:',
    }));
  }
}
