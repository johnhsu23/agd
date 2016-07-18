/**
 * List of error codes from the NDE-fed 'GetChartData' API.
 */
export const enum ErrorFlag {
  // double dagger
  StandardsNotMet = 1 << 0,
  HighCV = 1 << 2,

  // show raised 1 after year
  NonAccommodatedSample = 1 << 3,

  // double dagger
  ExclusionList = 1 << 4,
  NonQualifiedIndependentVariable = 1 << 5,

  // em dash
  NoData = 1 << 6,

  // pound sign
  RoundsToZero = 1 << 7,

  // single dagger for SE (unused for NRC reporting)
  StandardErrNotApplicable = 1 << 8,

  // special notes
  RaceNoteType1 = 1 << 9,
  JurisdictionNote = 1 << 17,
  RaceNoteType2 = 1 << 22,
  RaceNoteType3 = 1 << 23,
}

/**
 * The combination of error codes that determine if a value is flagged as "Not Applicable".
 */
export const notApplicable = ErrorFlag.StandardsNotMet
                           | ErrorFlag.HighCV
                           | ErrorFlag.ExclusionList
                           | ErrorFlag.NonQualifiedIndependentVariable;

/**
 * Determines if a value is flagged as not available.
 * If this function returns true, code should display an em dash (U+2014) and suppress the significance marker.
 */
export function isNotAvailable(errorCode: number): boolean {
  return (errorCode & ErrorFlag.NoData) !== 0;
}

/**
 * Determines if a value is flagged as "reporting standards not met".
 * If this function returns true, code should display a double dagger (U+2021) and suppress the significance marker.
 */
export function isNotApplicable(errorCode: number): boolean {
  return (errorCode & notApplicable) !== 0;
}

/**
 * Determines if a value is flagged as rounding to zero.
 * If this function returns true, code should display a pound sign (#). It is safe to display the significance marker.
 */
export function isRoundsToZero(errorCode: number): boolean {
  return (errorCode & ErrorFlag.RoundsToZero) !== 0;
}

/**
 * Formats a given estimate value according to NRC/NAEP guidelines. Uses NDE error flag information for special values.
 * @param estimate the numerical estimate
 * @param sig the sig test result (usually a one-character string)
 * @param errorCode the error code returned by the NDE API.
 */
export function formatValue(estimate: number, sig: string, errorCode: number): string {
  if (isNotAvailable(errorCode)) {
    return '\u2014';
  }

  if (isNotApplicable(errorCode)) {
    return '\u2021';
  }

  let formatted: string;
  if (isRoundsToZero(errorCode)) {
    formatted = '#';
  } else {
    formatted = '' + Math.round(estimate);
  }

  // hack: 2015 rows have some issues
  if ((sig === '<' || sig === '>')) {
    formatted += '*';
  }

  return formatted;
}
