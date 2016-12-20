import {default as Legend, LegendAttributes} from 'models/legend';
import modelProperty from 'util/model-property';

import BarLegendView from 'views/legend/bar';

export interface BarLegendAttributes extends LegendAttributes {
  category: number;
  description: string;
}

export default class BarLegend extends Legend implements LegendAttributes {
  @modelProperty()
  category: number;

  @modelProperty()
  description: string;

  getView(): new(...args: any[]) => BarLegendView<BarLegend> {
    return BarLegendView;
  }

  constructor(attributes: BarLegendAttributes, options?: any) {
    super(attributes, options);
  }
}
