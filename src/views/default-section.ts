import {View} from 'backbone.marionette';
import Section from 'views/section';
import {ViewOptions} from 'backbone';

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
  }
}

export default DefaultSection;
