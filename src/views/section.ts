import {LayoutView} from 'backbone.marionette';
import * as template from 'text!templates/section.html';
import configure from 'util/configure';

@configure({
  className: 'section',
})
export default class SectionView extends LayoutView<any> {
  template = () => template;

  setTitle(title: string): void {
    this.$('.section__title')
      .text(title);
  }

  regions(): {[key: string]: string} {
    return {
      contents: '.section__contents',
      controls: '.section__controls',
    };
  }
}
