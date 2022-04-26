import { FUN } from '@typen/enum-data-types'

/**
 *
 * @param {CrosTab|CrostabObject} table
 * @param {[*,*,*]|{from:[*,*,*],by:function,to:function}} [conf]
 * @returns {Generator<*, void, *>}
 */
export function* indexed(table, conf) {
  const by = conf?.by, to = conf?.to
  if (typeof by === FUN) {
    if (typeof to === FUN) {
      yield* filterMappedIndexed(table, conf)
    }
    else {
      yield* filterIndexed(table, conf)
    }
  }
  else {
    if (typeof to === FUN) {
      yield* mappedIndexed(table, conf)
    }
    else {
      yield* simpleIndexed(table, conf?.from ?? conf)
    }
  }
}

export function* simpleIndexed(table, from) {
  const { head, rows } = table
  const [ i, j, k ] = from.map(x => head.indexOf(x))
  for (let row of rows) {
    yield [ row[i], row[j], row[k] ]
  }
}

export function* filterIndexed(table, { from, by }) {
  const { head, rows } = table
  const [ i, j, k ] = from.map(x => head.indexOf(x))
  for (let row of rows) {
    const x = row[i], y = row[j], v = row[k]
    if (by(x, y, v))
      yield [ x, y, v ]
  }
}

export function* mappedIndexed(table, { from, to }) {
  const { head, rows } = table
  const [ i, j, k ] = from.map(x => head.indexOf(x))
  for (let row of rows) {
    yield to(row[i], row[j], row[k])
  }
}

export function* filterMappedIndexed(table, { from, by, to }) {
  const { head, rows } = table
  const [ i, j, k ] = from.map(x => head.indexOf(x))
  for (let row of rows) {
    const x = row[i], y = row[j], v = row[k]
    if (by(x, y, v))
      yield to(x, y, v)
  }
}