import * as $ from 'jquery';

/**
 * The parameters accepted by Twitter's 'tweet' web intent.
 */
export interface Options {
  /**
   * The text of this tweet. If omitted, defaults to the page's title.
   */
  text?: string;
  /**
   * A URL to link to. If omitted, defaults to the page URL.
   */
  url?: string;
  //
  // NOTE: The following query parameters are accepted by Twitter's web intents, but we do not
  // use them. They are left here in commented-out form in anticipation of upstream clients
  // asking if it is possible to include this functionality.
  //
  // /**
  //  * Suggested hash tags. Will appear in the tweet body with a "#" character pre-appended.
  //  */
  // hashtags?: string[];
  // /**
  //  * A Twitter username to append to this tweet. Will appear as "via @username".
  //  */
  // via?: string;
  // /**
  //  * A list of additional usernames related to this tweet.
  //  *
  //  * Quoth Twitter: "Twitter may suggest these accounts to follow after the user
  //  * posts his or her Tweet."
  //  */
  // related?: {
  //   /** The account name. */
  //   account: string;
  //   /** An optional label like "Twitter News". */
  //   label?: string;
  // }[];
  // /** The Tweet ID of a parent tweet. */
  // inReplyTo?: string;
}

const intentEndpoint = 'https://twitter.com/intent/tweet';

/**
 * Returns the URL for a Twitter intent to tweet.
 */
export function url(options: Options): string {
  const params: {[key: string]: string} = Object.create(null);

  if (options.url) {
    params['url'] = options.url;
  }

  if (options.text) {
    params['text'] = options.text;
  } else {
    params['text'] = document.title;
  }

  params['via'] = 'NAEP_NCES';

  const q = $.param(params),
    url = intentEndpoint + (q ? '?' + q : '');

  return url;
}

// The below description sounds kind of ominous, actually
/**
 * Opens a window with intent to Tweet.
 */
export function share(options: Options): void {
    const opts = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
        width = 550,
        height = 420,
        winHeight = window.screen.height,
        winWidth = window.screen.width,
        href = url(options);

    const left = Math.round((winWidth / 2) - (width / 2)),
        top = winHeight > height ? Math.round((winHeight / 2) - (height / 2)) : 0,
        winOpts = opts + ',width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;

    window.open(href, 'twitter-share-dialog', winOpts);
}
