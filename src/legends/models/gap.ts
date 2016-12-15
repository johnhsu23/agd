import {default as Legend, LegendAttributes} from 'legends/models/base';
import GapLegendView from 'legends/views/gap';
import modelProperty from 'util/model-property';

export interface GapLegendAttributes extends LegendAttributes {
  significant: boolean;
}

export default class GapLegend extends Legend implements LegendAttributes {
  @modelProperty()
  significant: boolean;

  getView(): new(...args: any[]) => GapLegendView {
    return GapLegendView;
  }

  constructor(attributes: GapLegendAttributes, options?: any) {
    super(attributes, options);
  }
}
