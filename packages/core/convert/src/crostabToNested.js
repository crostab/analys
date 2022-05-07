import { indexed }    from '@analys/crostab-indexed'
import { updateCell } from '@vect/nested'

export const crostabToNested = (crostab, by, to) => {
  const o = {}
  for (const [ x, y, v ] of indexed(crostab, by, to)) updateCell.call(o, x, y, v)
  return o
}

