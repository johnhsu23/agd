import {ItemView} from 'backbone.marionette';
import {Model} from 'backbone';

import * as template from 'text!templates/footer.html';

export default class SiteFooter extends ItemView<Model> {
  template = () => template;

}
