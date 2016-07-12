import {CollectionView} from 'backbone.marionette';
import Legend from 'legends/model';
import LegendItemView from 'views/legend-item';

import configure from 'util/configure';

@configure({
  className: 'legend',
  childView: LegendItemView as { new(...args: any[]): LegendItemView },
})
export default class LegendView extends CollectionView<Legend, LegendItemView> {
}
