import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

import Page from 'views/page';

import DefaultSection from 'views/default-section';

import * as sampleQuestionsCommentary from 'json!commentary/questions-analysis/sample-questions.json';
import * as knowledgeSkillsCommentary from 'json!commentary/questions-analysis/knowledge-skills.json';
import * as performanceCommentary from 'json!commentary/questions-analysis/performance.json';

export default class QuestionsAnalysis extends Page {
  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: sampleQuestionsCommentary[this.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: knowledgeSkillsCommentary[this.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: performanceCommentary[this.subject],
    }));
  }
}
