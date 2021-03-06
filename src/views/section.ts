import {LayoutView} from 'backbone.marionette';
import * as template from 'text!templates/section.html';
import configure from 'util/configure';

export type Dict = { [key: string]: string };

@configure({
  className: 'section__inner',
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

  setCommentary(commentary: Dict): void {
    const {title, subtitle, commentary: narrative, footer} = commentary;

    this.$('.section__title').html(title);
    this.$('.section__subtitle').html(subtitle);
    this.$('.section__commentary').html(narrative);
    this.$('.section__footer').html(footer);
  }
}
