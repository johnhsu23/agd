import {Model} from 'backbone';

import modelProperty from 'util/model-property';

export interface ShareOptions {
  /**
   * Can users download this figure?
   */
  download?: boolean;

  /**
   * The path to be shared.
   */
  path?: string;

  /**
   * The path to be shared.
   */
  section?: string;

  /**
   * The path to be shared.
   */
  message?: string;
}

export class ShareModel extends Model {
  @modelProperty()
  download: boolean;

  @modelProperty()
  path: string;

  @modelProperty()
  section: string;

  @modelProperty()
  message: string;

  constructor(options?: ShareOptions) {
    super(options);
  }
}

export default ShareModel;
