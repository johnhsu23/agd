import {default as Legend, LegendAttributes} from 'models/legend';
import TextLegendView from 'views/legend/text';
import modelProperty from 'util/model-property';

export interface TextLegendAttributes extends LegendAttributes {
  marker: string;
  description: string;
}

export default class TextLegend extends Legend implements TextLegendAttributes {
  @modelProperty()
  marker: string;

  @modelProperty()
  description: string;

  getView(): new(...args: any[]) => TextLegendView {
    return TextLegendView;
  }

  constructor(attributes: TextLegendAttributes, options?: any) {
    super(attributes, options);
  }
}
