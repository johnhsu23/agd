import {ItemView} from 'backbone.marionette';
import {Model} from 'backbone';

import * as template from 'text!templates/homepage.html';

export default class HomepageView extends ItemView<Model> {
  template = () => template;
}
