import {Model} from 'backbone';

import modelProperty from 'util/model-property';

export interface ShareOptions {
  /**
   * Can users download this figure?
   */
  download?: boolean;
}

export class ShareModel extends Model {
  @modelProperty()
  download: boolean;

  constructor(options?: ShareOptions) {
    super(options);
  }
}

export default ShareModel;
