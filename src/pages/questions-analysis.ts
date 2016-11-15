import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

import Page from 'views/page';
import DefaultSection from 'views/default-section';

import context from 'models/context';

import * as sampleQuestionsCommentary from 'json!commentary/questions-analysis/sample-questions.json';
import * as knowledgeSkillsCommentary from 'json!commentary/questions-analysis/knowledge-skills.json';
import * as performanceCommentary from 'json!commentary/questions-analysis/performance.json';

export default class QuestionsAnalysis extends Page {
  pageTitle = 'Sample Questions Analysis';

  onBeforeShow(): void {
    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: sampleQuestionsCommentary[context.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: knowledgeSkillsCommentary[context.subject],
    }));

    this.pushSection(new DefaultSection({
      inner: new (class extends ItemView<Model> { template = () => '' }),
      commentary: performanceCommentary[context.subject],
    }));
  }
}
