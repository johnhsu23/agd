import {Model} from 'backbone';

import {ContextualVariable} from 'data/contextual-variables';
import modelProperty from 'util/model-property';

export interface Data {
  value: number;
  sig: string;
  errorFlag: number;
  isStatDisplayable: boolean;
}

export default class HeatModel extends Model {
  @modelProperty()
  label: string;

  @modelProperty()
  contextualVariable: ContextualVariable;

  @modelProperty()
  data: Data[];
}
