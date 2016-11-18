import * as Bluebird from 'bluebird';

import {load as loadGaps, Data as GapData} from 'pages/score-gaps/gaps-data/gaps';
import {load as loadTrends, Data as TrendData} from 'pages/score-gaps/gaps-data/trends';
import {load as loadGapTrends, Data as GapTrendData} from 'pages/score-gaps/gaps-data/gap-trends';

import {Variable} from 'data/variables';

export {
  GapData,
  TrendData,
  GapTrendData,
};

export interface Result {
  gaps: GapData[];
  trend: GapTrendData;
  focal: TrendData;
  target: TrendData;
}

// Avoid compiler bug in 2.1.x -- `export async function foo()` results in the __awaiter() helper using the global
// Promise instead of abiding the type-directed output. But we can avoid it by exporting separately.
export {load};

async function load(variable: Variable, focal: number, target: number): Bluebird<Result> {
  const id = variable.id;

  // Load data
  const gaps = await loadGaps(id, focal, target),
        trends = await loadTrends(id, focal, target),
        gapTrend = await loadGapTrends(id, focal, target);

  // Determine which of the two trend data points is the focal one
  const focalIndex = +(trends[0].categoryindex !== focal), // foo !== focal ==> false (numerically 0)
        targetIndex = 1 - focalIndex;                      // focalIndex is either 0 or 1, so 1 - n ==> 0 or 1.

  return Bluebird.resolve({
    gaps,
    trend: gapTrend,
    focal: trends[focalIndex],
    target: trends[targetIndex],
  });
}
