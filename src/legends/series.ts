import Model from 'legends/model';

import makeSymbol from 'components/symbol';

const symbol = makeSymbol<void>()
  .size(194);

export default function series(type: string, description: string): Model {
  return new Model({
    type: 'path',
    marker: symbol.type(type)(null, null),
    description,
  });
}
