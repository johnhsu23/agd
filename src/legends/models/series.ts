import {SymbolType} from 'd3-shape';

import {default as Legend, LegendAttributes} from 'legends/models/base';
import SeriesLegendView from 'legends/views/series';

import modelProperty from 'util/model-property';

export interface SeriesLegendAttributes extends LegendAttributes {
  type: SymbolType;
  description: string;
}

export default class SeriesLegend extends Legend implements SeriesLegendAttributes {
  @modelProperty()
  type: SymbolType;

  @modelProperty()
  description: string;

  getView(): new(...args: any[]) => SeriesLegendView {
    return SeriesLegendView;
  }

  constructor(attributes: SeriesLegendAttributes, options?: any) {
    super(attributes, options);
  }
}
