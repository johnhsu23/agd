import {default as Legend, LegendAttributes} from 'legends/models/base';

import modelProperty from 'util/model-property';

export interface NoteLegendAttributes extends LegendAttributes {
  description: string;
}

export default class NoteLegend extends Legend implements NoteLegendAttributes {
  @modelProperty()
  description: string;

  getView(): any {
    return null;
  }

  constructor(attributes: NoteLegendAttributes, options?: any) {
    super(attributes, options);
  }
}
