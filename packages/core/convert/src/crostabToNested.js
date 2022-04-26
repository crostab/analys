import { filterIndexed, simpleIndexed } from '@analys/crostab-indexed'
import { FUN }                          from '@typen/enum-data-types'

export const crostabToNested = (crostab, filter) => {
  // const by = conf?.by, to = conf?.to ?? conf
  const o = {}
  if (typeof filter === FUN) {
    for (const [x, y, v] of filterIndexed(crostab, filter)) (o[x] ?? (o[x] = {}))[y] = v
  } else {
    for (const [x, y, v] of simpleIndexed(crostab)) (o[x] ?? (o[x] = {}))[y] = v
  }
  return o
}