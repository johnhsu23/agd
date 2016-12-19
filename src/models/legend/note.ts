import {default as Legend, LegendAttributes} from 'models/legend';
import NoteLegendView from 'views/legend/note';
import modelProperty from 'util/model-property';

export interface NoteLegendAttributes extends LegendAttributes {
  description: string;
}

export default class NoteLegend extends Legend implements NoteLegendAttributes {
  @modelProperty()
  description: string;

  getView(): new(...args: any[]) => NoteLegendView<NoteLegend> {
    return NoteLegendView;
  }

  constructor(attributes: NoteLegendAttributes, options?: any) {
    super(attributes, options);
  }
}
