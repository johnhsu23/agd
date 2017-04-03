import * as Promise from 'bluebird';

interface Tracker {
  push(values: (string | number | boolean)[]): void;
}

/*
 * Promise for the custom tracker defined in NRC.gov's federated-analytics.min.js file.
 *
 * This file is very likely to be loaded BEFORE federated-analytics, which means that we can't
 * rely on that file having created its global variables.
 *
 * In order to avoid a lot of crufty initialization code, we'll just wrap in a promise that
 * checks infrequently for the variable to exist. This means that, at most, there will be a
 * single second's worth of latency when reporting the first few events on the page,
 * should the user be fast enough to click something before this promise resolves.
 *
 * I consider this acceptable.
 */
const tracker = new Promise<Tracker>((resolve) => {
  /*
   * Check for _gas existing.
   *
   * Note that it is technically possible for this promise to never resolve. I don't consider
   * this a problem, since the memory leaked by the promise's handlers are fairly small closures,
   * and there aren't likely to be many during a user's session.
   */
  const interval = setInterval(function () {
    if (typeof (<any> window)._gas !== 'undefined') {
      resolve((<any> window)._gas);

      clearInterval(interval);
    }
  }, 1000);
});

/**
 * Report a custom event to Google Analytics.
 */
export function push(
  method: '_trackEvent',
  category: string,
  action: string,
  label?: string,
  value?: number,
  noninteraction?: boolean): void;

/**
 * Asynchronously invoke Google Analytics.
 */
export function push(method: string, ...values: (number | string | boolean)[]): void;

// Implementation function for push() interfaces above.
// See comments on `tracker' for why we wait on a promise here.
export function push(...values: (number | string | boolean)[]): void {
  tracker
    .then(tracker => tracker.push(values))
    .done();
}
