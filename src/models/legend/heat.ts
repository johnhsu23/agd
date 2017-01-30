import {default as Legend, LegendAttributes} from 'models/legend';
import modelProperty from 'util/model-property';

import HeatLegendView from 'views/legend/heat';

export interface HeatLegendAttributes extends LegendAttributes {
  category: number;
  description: string;
}

export default class HeatLegend extends Legend implements LegendAttributes {
  @modelProperty()
  category: number;

  @modelProperty()
  description: string;

  getView(): new(...args: any[]) => HeatLegendView<HeatLegend> {
    return HeatLegendView;
  }

  constructor(attributes: HeatLegendAttributes, options?: any) {
    super(attributes, options);
  }
}

export const HeatLegendItems: string[] = [
  '50% or greater',
  '40% to 49%',
  '30% to 39%',
  '10% to 29%',
  'Less than 10%',
];

export function getHeatLegendItems(): Legend[] {
  return HeatLegendItems.map((d, i) => {
    return new HeatLegend({
      category: i,
      description: d,
    });
  });
}
