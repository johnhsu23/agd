import {LayoutView} from 'backbone.marionette';
import * as template from 'text!templates/section.html';

export default class SectionView extends LayoutView<any> {
  template = () => template;

  regions(): {[key: string]: string} {
    return {
      inner: '.section__inner',
    };
  }
}
