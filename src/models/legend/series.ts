import {SymbolType} from 'd3-shape';

import {default as Legend, LegendAttributes} from 'models/legend';
import SeriesLegendView from 'views/legend/series';

import modelProperty from 'util/model-property';

export interface SeriesLegendAttributes extends LegendAttributes {
  marker: SymbolType;
  description: string;
}

export default class SeriesLegend extends Legend implements SeriesLegendAttributes {
  @modelProperty()
  marker: SymbolType;

  @modelProperty()
  description: string;

  getView(): new(...args: any[]) => SeriesLegendView<SeriesLegend> {
    return SeriesLegendView;
  }

  constructor(attributes: SeriesLegendAttributes, options?: any) {
    super(attributes, options);
  }
}
