import {SymbolType} from 'd3-shape';

import SeriesLegend from 'models/legend/series';

export default function series(marker: SymbolType, description: string): SeriesLegend {
  return new SeriesLegend({
    marker,
    description,
  });
}
