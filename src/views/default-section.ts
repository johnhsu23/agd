import {View} from 'backbone.marionette';
import {ViewOptions} from 'backbone';

import Switcher from 'views/grade-switcher';
import Section from 'views/section';

export interface DefaultSectionOptions extends ViewOptions<any> {
  inner: View<any>;
}

export class DefaultSection extends Section {
  inner: View<any>;

  constructor(options: DefaultSectionOptions) {
    super(options);

    this.inner = options.inner;
  }

  onBeforeShow(): void {
    this.showChildView('inner', this.inner);
    this.showChildView('controls', new Switcher);
  }
}

export default DefaultSection;
