import { matchSlice }    from '@analys/table-init'
import { selectTabular } from '@analys/tabular'
import { randBetw }      from '@aryth/rand'
import { shuffle }       from '@vect/vector-select'

const MEAN = 5

export function tableShuffle(table, { h, w, oscillate } = {}) {
  let { head, rows } = matchSlice(table)
  if (!h || oscillate) h = randBetw(MEAN - 1, MEAN + 5)
  if (!w || oscillate) w = randBetw(MEAN - 2, MEAN + 1)
  const headSelection = shuffle(head.slice(), w)
  rows = shuffle(rows.slice(), h)
  return selectTabular.call({ head, rows }, headSelection)
}
