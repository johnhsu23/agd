import {Model} from 'backbone';

import modelProperty from 'util/model-property';

/**
 * Global context. This is used to avoid excessive passing of a subject instance variable from pages to subordinate
 * views (like figures and charts).
 */
export class Context extends Model {
  /**
   * The subject currently being viewed by the user.
   *
   * When this value is `undefined`, the page is subject-neutral (e.g., About or the home page).
   */
  @modelProperty()
  public subject: undefined | 'music' | 'visual arts';

  /**
   * The section of the page to scroll to after rendering.
   *
   * When the value is undefined, the page will not scroll.
   */
  @modelProperty()
  public anchor: string;

  /**
   * The accordion ID that we'll want to open
   */
  @modelProperty()
  public accordion: string;
}

/**
 * The default context instance.
 */
export const context = new Context;

export default context;
