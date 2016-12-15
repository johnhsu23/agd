import {default as SeriesLegend, SeriesLegendAttributes} from 'legends/models/series';
import ComparisonLegendView from 'legends/views/comparison';
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
