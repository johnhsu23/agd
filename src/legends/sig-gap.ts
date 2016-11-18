import Model from 'legends/model';

import {symbol, symbolCircle} from 'd3-shape';

export default function significantGap(): Model {
  const marker = symbol()
    .size(194)
    .type(symbolCircle)
    ();

  return new Model({
    type: 'gap',
    marker,
    description: 'Significant difference',
  });
}
