import Model from 'legends/model';

import {symbol} from 'd3-shape';
import {gapDiamond} from 'components/symbol';

export default function insignificantGap(): Model {
  const marker = symbol()
    .size(194)
    .type(gapDiamond)
    ();

  return new Model({
    type: 'path',
    marker,
    description: 'No significant difference',
  });
}
