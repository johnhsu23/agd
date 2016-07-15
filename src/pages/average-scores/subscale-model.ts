import {Model} from 'backbone';
import modelProperty from 'util/model-property';
import {Data} from 'api/tuda-acrossyear';

interface ModelAttributes {
  year: number;
  SRPS1: Data;
  SRPS2: Data;
  SRPS3: Data;
}

export default class SubscaleModel extends Model {
  constructor(attributes: ModelAttributes) {
    super(attributes);
  }

  @modelProperty()
  year: number;

  @modelProperty()
  SRPS1: Data;

  @modelProperty()
  SRPS2: Data;

  @modelProperty()
  SRPS3: Data;
}
