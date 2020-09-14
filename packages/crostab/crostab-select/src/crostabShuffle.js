import { flopIndex, randIntBetw } from '@aryth/rand'
import { matchSlice } from '@analys/crostab-init'
import { leap, shuffle }      from '@vect/vector-select'
import { selectTabular } from '@analys/tabular'
import { selectKeyedRows }    from '@analys/keyed-rows'

const MEAN = 4

export function crostabShuffle (crostab, { h, w, oscillate } = {}) {
  crostab = crostab |> matchSlice
  if (!h || oscillate) h = randIntBetw(MEAN - 1, MEAN + 4)
  if (!w || oscillate) w = randIntBetw(MEAN - 1, MEAN + 1);
  const
    sideSelection = leap(crostab.side, flopIndex(crostab.side), h),
    headSelection = shuffle(crostab.head, w)
  if (sideSelection?.length) selectKeyedRows.call(crostab, sideSelection)
  if (headSelection?.length) selectTabular.call(crostab, headSelection)
  return crostab
}
