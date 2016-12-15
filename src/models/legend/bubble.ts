import Legend from 'models/legend';
import BubbleLegendView from 'views/legend/bubble';

export default class BubbleLegend extends Legend {
  getView(): new(...args: any[]) => BubbleLegendView {
    return BubbleLegendView;
  }
}
