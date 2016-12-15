import {default as Legend, LegendAttributes} from 'models/legend';
import GapLegendView from 'views/legend/gap';
import modelProperty from 'util/model-property';

export interface GapLegendAttributes extends LegendAttributes {
  significant: boolean;
}

export default class GapLegend extends Legend implements LegendAttributes {
  @modelProperty()
  significant: boolean;

  getView(): new(...args: any[]) => GapLegendView<GapLegend> {
    return GapLegendView;
  }

  constructor(attributes: GapLegendAttributes, options?: any) {
    super(attributes, options);
  }
}
