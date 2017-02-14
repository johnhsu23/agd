import {ItemView} from 'backbone.marionette';

import configure from 'util/configure';
import FocalBubbleLegend from 'models/legend/focal-bubble';

import * as template from 'text!templates/legend-focal-bubble.html';

@configure({
  className: 'legend__item legend__item--focal-bubble',
})
export default class FocalBubbleLegendView<Legend extends FocalBubbleLegend> extends ItemView<Legend> {
  template = () => template;
}
