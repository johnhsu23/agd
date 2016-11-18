import Model from 'legends/model';

import {symbol, types as symbolTypes} from 'components/symbol';

export default function category(category: number, name: string): Model {
  const marker = symbol()
    .size(194)
    .type(symbolTypes[category])
    ();

  return new Model({
    type: 'path',
    marker,
    description: name,
  });
}
