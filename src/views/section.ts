import noTemplate from 'util/no-template';
import {LayoutView} from 'backbone.marionette';

@noTemplate
export default class SectionView extends LayoutView<any> {
  regions(): {[key: string]: string} {
    return {
      inner: '.section__inner',
    };
  }
}
