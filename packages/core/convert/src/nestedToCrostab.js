import { Crostab }                  from '@analys/crostab'
import { DataGram }                 from '@analys/data-gram'
import { indexed as indexedNested } from '@vect/nested'

export function nestedToCrostab(nested, init, by, to) {
  const dataGram = DataGram.build(init)
  for (let [ x, y, v ] of indexedNested(nested, by, to)) {
    dataGram.update(x, y, v)
  }
  return Crostab.from(dataGram)
}

export function nestedToCrostabOfArray(nested, by, to) {
  const dataGram = DataGram.build(Array)
  for (let [ x, y, v ] of indexedNested(nested, by, to)) {
    dataGram.append(x, y, v)
  }
  return Crostab.from(dataGram)
}