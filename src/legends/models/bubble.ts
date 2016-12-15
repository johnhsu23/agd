import Legend from 'legends/models/base';
import BubbleLegendView from 'legends/views/bubble';

export default class BubbleLegend extends Legend {
  getView(): new(...args: any[]) => BubbleLegendView {
    return BubbleLegendView;
  }
}
