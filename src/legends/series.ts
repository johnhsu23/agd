import {SymbolType} from 'd3-shape';

import SeriesLegend from 'legends/models/series';

export default function series(marker: SymbolType, description: string): SeriesLegend {
  return new SeriesLegend({
    marker,
    description,
  });
}
