import {LayoutView} from 'backbone.marionette';
import * as template from 'text!templates/section.html';
import configure from 'util/configure';

@configure({
  className: 'section',
})
export default class SectionView extends LayoutView<any> {
  template = () => template;

  regions(): {[key: string]: string} {
    return {
      inner: '.section__inner',
    };
  }
}
