import LegendView from 'views/legend';

import configure from 'util/configure';
import HoverBehavior from 'behaviors/percentile-hover';

@configure({
  behaviors: {
    Hover: {
      behaviorClass: HoverBehavior,
    },
  },
})
export default class PercentileLegendView extends LegendView {
}
