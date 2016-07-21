import {View} from 'backbone.marionette';
import {ViewOptions} from 'backbone';

import Switcher from 'views/grade-switcher';
import Section from 'views/section';
import context from 'models/grade';

import configure from 'util/configure';

type Dict<T> = { [key: string]: T };
type Commentary = Dict<Dict<string>>;

export interface DefaultSectionOptions extends ViewOptions<any> {
  inner: View<any>;
  commentary?: Commentary;
}

@configure({
  model: context,
  modelEvents: {
    'change:grade': 'changedGrade',
  },
})
export class DefaultSection extends Section {
  protected inner: View<any>;
  protected commentary: Commentary;

  constructor(options: DefaultSectionOptions) {
    super(options);

    this.inner = options.inner;
    this.commentary = options.commentary;
  }

  onBeforeShow(): void {
    this.showChildView('contents', this.inner);
    this.showChildView('controls', new Switcher);
    if (this.commentary) {
      this.setCommentary(this.commentary[this.model.grade]);
    }
  }

  protected changedGrade(): void {
    if (this.commentary) {
      this.setCommentary(this.commentary[this.model.grade]);
    }
  }
}

export default DefaultSection;
