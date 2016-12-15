import {SymbolType} from 'd3-shape';

import ComparisonLegend from 'legends/models/comparison';

export function focal(marker: SymbolType, description: string): ComparisonLegend {
  return new ComparisonLegend({
    type: 'focal',
    marker,
    description,
  });
}

export function target(marker: SymbolType, description: string): ComparisonLegend {
  return new ComparisonLegend({
    type: 'target',
    marker,
    description,
  });
}
