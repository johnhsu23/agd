import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';

import modelProperty from 'util/model-property';

export interface LegendAttributes {
  tag?: string;
}

abstract class Legend extends Model implements LegendAttributes {
  @modelProperty()
  tag: string;

  /**
   * Returns the view constructor most appropriate for rendering this legend.
   */
  abstract getView(): new(...args: any[]) => ItemView<Legend>;

  constructor(attributes: LegendAttributes, options?: any) {
    super(attributes, options);
  }
}

export default Legend;
