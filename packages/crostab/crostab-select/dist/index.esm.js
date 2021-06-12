import { matchSlice } from '@analys/crostab-init';
import { selectKeyedRows } from '@analys/keyed-rows';
import { selectTabular } from '@analys/tabular';
import { randBetw, flopIndex } from '@aryth/rand';
import { leap, shuffle } from '@vect/vector-select';

const MEAN = 4;
function crostabShuffle(crostab, {
  h,
  w,
  oscillate
} = {}) {
  var _crostab;

  crostab = (_crostab = crostab, matchSlice(_crostab));
  if (!h || oscillate) h = randBetw(MEAN - 1, MEAN + 4);
  if (!w || oscillate) w = randBetw(MEAN - 1, MEAN + 1);
  const sideSelection = leap(crostab.side, flopIndex(crostab.side), h),
        headSelection = shuffle(crostab.head, w);
  if (sideSelection != null && sideSelection.length) selectKeyedRows.call(crostab, sideSelection);
  if (headSelection != null && headSelection.length) selectTabular.call(crostab, headSelection);
  return crostab;
}

export { crostabShuffle };
