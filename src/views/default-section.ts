import {View} from 'backbone.marionette';
import {ViewOptions} from 'backbone';

import Section from 'views/section';

type Dict<T> = { [key: string]: T };
type Commentary = Dict<string>;

export interface DefaultSectionOptions extends ViewOptions<any> {
  inner: View<any>;
  commentary?: Commentary;
}

export class DefaultSection extends Section {
  protected inner: View<any>;
  protected commentary: Commentary;

  constructor(options: DefaultSectionOptions) {
    super(options);

    this.inner = options.inner;
    this.commentary = options.commentary;
  }

  onRender(): void {
    this.showChildView('contents', this.inner);
    this.setCommentary(this.commentary);
  }
}

export default DefaultSection;
