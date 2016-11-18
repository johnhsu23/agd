import {Model} from 'backbone';

import modelProperty from 'util/model-property';

export type LegendType = 'note' | 'text' | 'path';

export interface LegendAttributes {
  type: LegendType;
  marker: string;
  description: string;
  tag?: string;
}

export class Legend extends Model implements LegendAttributes {
  @modelProperty()
  type: LegendType;

  @modelProperty()
  marker: string;

  @modelProperty()
  description: string;

  @modelProperty()
  tag: string | undefined;

  constructor(attributes: LegendAttributes, options?: any) {
    super(attributes, options);
  }
}

export default Legend;
