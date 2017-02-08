import * as $ from 'jquery';

export interface Options {
  /**
   * The URL to share. This must be a full URL.
   */
  u: string;

  /**
   * An optional quote. This does not pre-populate the user's share dialog. Instead,
   * it is an addition to their own post.
   */
  quote?: string;
}

const shareEndpoint = 'https://www.facebook.com/sharer.php';

/**
 * Constructs the URL
 */
function url(options: Options): string {
  return shareEndpoint + '?' + $.param(options);
}

/**
 * Share a URL and, optionally, a pull quote via Facebook.
 */
export default function share(options: Options): void {
  const opts = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
      width = 550,
      height = 420,
      winHeight = window.screen.height,
      winWidth = window.screen.width,
      href = url(options);

  const left = Math.round((winWidth / 2) - (width / 2)),
      top = winHeight > height ? Math.round((winHeight / 2) - (height / 2)) : 0,
      winOpts = opts + ',width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;

  window.open(href, 'facebook-share-dialog', winOpts);
}
