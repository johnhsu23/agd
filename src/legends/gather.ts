import Legend from 'models/legend';
import * as codes from 'codes';

import sigDiff from 'legends/sig-diff';
import notAvailable from 'legends/not-available';
import roundsZero from 'legends/rounds-zero';
import notApplicable from 'legends/not-applicable';

interface Notes {
  sigDiff: boolean;
  roundsZero: boolean;
  notAvailable: boolean;
  notApplicable: boolean;
}

/**
 * Gathers all footnote symbols and returns an array of legend symbols.
 */
export function all<Row>(rows: Row[], errorFlag: (row: Row, index: number) => number,
  sig?: (row: Row, index: number) => string): Legend[] {
  const legends: Legend[] = [];
  if (!rows) {
    return legends;
  }

  const notes: Notes = {
    sigDiff: false,
    roundsZero: false,
    notAvailable: false,
    notApplicable: false,
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i],
          flag = errorFlag(row, i),
          // if sig was not passed through, use empty string
          sigDiff = (sig) ? sig(row, i) : '';

    if (codes.isNotApplicable(flag)) {
      notes.notApplicable = true;
    }

    if (codes.isNotAvailable(flag)) {
      notes.notAvailable = true;
    }

    if (codes.isRoundsToZero(flag)) {
      notes.roundsZero = true;
    }

    if (sigDiff === '>' || sigDiff === '<') {
      notes.sigDiff = true;
    }
  }

  /**
   * add the notes to the legend in the correct order:
   * 1. — (not available)
   * 2. # (rounds to zero)
   * 3. ‡ (not applicable)
   * 4. * (significantly different)
   */
  if (notes.notAvailable) {
    legends.push(notAvailable());
  }

  if (notes.roundsZero) {
    legends.push(roundsZero());
  }

  if (notes.notApplicable) {
    legends.push(notApplicable());
  }

  if (notes.sigDiff) {
    legends.push(sigDiff());
  }

  return legends;
}
