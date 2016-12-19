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
export function all<Row>(rows: Row[], errorFlag: (row: Row, index: number) => number): Legend[] {
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
          flag = errorFlag(row, i);

    if (codes.isNotApplicable(flag)) {
      notes.notApplicable = true;
    }

    if (codes.isNotAvailable(flag)) {
      notes.notAvailable = true;
    }

    if (codes.isRoundsToZero(flag)) {
      notes.roundsZero = true;
    }
  }

  if (notes.sigDiff) {
    legends.push(sigDiff());
  }

  if (notes.notAvailable) {
    legends.push(notAvailable());
  }

  if (notes.roundsZero) {
    legends.push(roundsZero());
  }

  if (notes.notApplicable) {
    legends.push(notApplicable());
  }

  return legends;
}
