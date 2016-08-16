import Model from 'legends/model';

import {symbol, SymbolType} from 'd3-shape';

export default function series(type: SymbolType, description: string): Model {
  const marker = symbol()
    .size(194)
    .type(type);

  return new Model({
    type: 'path',
    marker: marker(),
    description,
  });
}
