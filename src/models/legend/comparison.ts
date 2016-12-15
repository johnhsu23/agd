import {default as SeriesLegend, SeriesLegendAttributes} from 'models/legend/series';
import ComparisonLegendView from 'views/legend/comparison';
import modelProperty from 'util/model-property';

export type FocalTarget = 'focal' | 'target';

export interface ComparisonLegendAttributes extends SeriesLegendAttributes {
  type: FocalTarget;
}

export default class ComparisonLegend extends SeriesLegend implements ComparisonLegendAttributes {
  @modelProperty()
  type: FocalTarget;

  getView(): new(...args: any[]) => ComparisonLegendView<ComparisonLegend> {
    return ComparisonLegendView;
  }

  constructor(attributes: ComparisonLegendAttributes, options?: any) {
    super(attributes, options);
  }
}
