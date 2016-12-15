import {history} from 'backbone';

/**
 * Represents the current state of the route, in terms of things we care about.
 */
export interface Location {
  /**
   * The base router path.
   */
  path: string;
  /**
   * The page section. If none is present in the URL, this is `null`.
   */
  section: string;
  /**
   * Any query parameters. Note that the key `'grade'` will always be present.
   */
  query: {[key: string]: string};
}

/**
 * Create a new `Location` object from the route the user is viewing.
 */
export function get(): Location {
  let path = history.getFragment(),
    section: string = null;

  // Normalize leading slashes (NB. this may be unneeded)
  path = path.replace(/^\/+/, '');

  // Handle sectioning elements
  // Since sections are kinda ad-hoc, please remember to update this regex if you've created
  // something that doesn't match the structure here.
  const re = /\/(:?chart_loc|section)_\d/,
      result = path.match(re);
  if (result) {
    // Use .substring(1) to offset required leading '/' character
    // This changes 'foo/section_1' to { path: 'foo', section: 'section_1' }
    section = result[0].substring(1);
    path = path.replace(re, '');
  }

  // Parse query string parameters.
  // We don't handle duplicated params (like PHP's "?foo[]=bar&foo[]=baz"), we just stomp on them.
  const query: { [key: string]: string } = {},
      index = path.indexOf('?');
  if (index >= -1) {
    const args = path.substring(index + 1).split('&');

    args.forEach(arg => {
      // NB. [key, value]
      // 2 is split limit: My understanding is that "a=b=c" is a legal query
      //string parameter with key 'a' and value 'b=c'.
      const split = arg.split('=', 2);

      query[split[0]] = split[1];
    });
  }

  // Strip query string from `path' variable since.
  path = path.replace(/\?.*$/, '');

  return {
    path: path,
    section: '',
    query: query,
  };
}

/**
 * Given a `Location` object, create a URL string acceptable to `Backbone.history.navigate()`.
 */
export function make(location: Location): string {
  let path = location.path;

  if (location.section) {
    path += '/' + location.section;
  }

  path += '?' + serialize(location.query);

  // If location.query is empty, we'll get a path like "foo/bar?".
  // For aesthetic reasons, strip it.
  return path.replace(/\?$/, '');
}

/**
 * Turn an object of key-value pairs into a query string, without the leading '?' character.
 */
function serialize(query: {[key: string]: string}): string {
  // This only looks complicated because encodeURIComponent(anything) looks more verbose than it is.
  return Object.keys(query)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
    .join('&');
}
