import { Crostab }                  from '@analys/crostab'
import { GramUtil, ListGram }       from '@analys/data-gram'
import { indexed as indexedNested } from '@vect/nested'

export function nestedToCrostab(nested, mode, by, to, po) {
  const gram = GramUtil.factory(mode)
  for (let [ x, y, v ] of indexedNested(nested, by, to)) {
    gram.update(x, y, v)
  }
  return Crostab.from(gram.toObject(po))
}

export function nestedToListGram(nested, by, to) {
  const gram = ListGram.build()
  for (let [ x, y, v ] of indexedNested(nested, by, to)) {
    gram.append(x, y, v)
  }
  return gram
}