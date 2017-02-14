import Legend from 'models/legend';
import FocalBubbleLegendView from 'views/legend/focal-bubble';

export default class FocalBubbleLegend extends Legend {
  getView(): new(...args: any[]) => FocalBubbleLegendView<FocalBubbleLegend> {
    return FocalBubbleLegendView;
  }
}
