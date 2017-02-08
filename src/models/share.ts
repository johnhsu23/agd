import {Model} from 'backbone';

import modelProperty from 'util/model-property';

export interface ShareOptions {
  /**
   * Can users download this figure?
   */
  download?: boolean;

  /**
   * The section id to which we will anchor.
   */
  section?: string;

  /**
   * The message to display in the share.
   */
  message?: string;

  /**
   * The accordion ID to share
   */
  accordion?: string;
}

export class ShareModel extends Model {
  @modelProperty()
  download: boolean;

  @modelProperty()
  section: string;

  @modelProperty()
  message: string;

  @modelProperty()
  accordion: string;

  constructor(options?: ShareOptions) {
    super(options);
  }
}

export default ShareModel;
