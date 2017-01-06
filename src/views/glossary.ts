import {Model, ViewOptions} from 'backbone';
import {ItemView} from 'backbone.marionette';

import noTemplate from 'util/no-template';

export interface GlossaryViewOptions extends ViewOptions<any> {
  term: string;
}

@noTemplate
export default class Glossary extends ItemView<Model> {
  protected term: string;

  constructor(options: GlossaryViewOptions) {
    super(options);

    this.term = options.term;
  }

  onRender(): void {
    this.$el.html(this.term);
  }
}
