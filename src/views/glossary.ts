import {Model, ViewOptions} from 'backbone';
import {ItemView} from 'backbone.marionette';

import * as template from 'text!templates/glossary.html';
import * as glossaryTerms from 'json!glossary/glossary.json';

export interface GlossaryViewOptions extends ViewOptions<any> {
  term: string;
}

export default class Glossary extends ItemView<Model> {
  template = () => template;

  protected termId: string;

  constructor(options: GlossaryViewOptions) {
    super(options);

    this.termId = options.term;
  }

  onRender(): void {
    const term = glossaryTerms[this.termId];
    this.$('.glossary__title em').text(term['title']);
    this.$('.glossary__description').html(term['description']);
  }
}
