import Model from 'legends/model';

import {svg as gen} from 'd3';

const symbol = gen.symbol<void>()
  .size(194);

export default function series(type: string, description: string): Model {
  return new Model({
    type: 'path',
    marker: symbol.type(type)(null),
    description,
  });
}
