import { FUN } from '@typen/enum-data-types'

/**
 *
 * @param {CrosTab|CrostabObject} crostab
 * @param {function|{by:function,to:function}} [conf]
 * @returns {Generator<*, void, *>}
 */
export function* indexed(crostab, conf) {
  const by = conf?.by, to = conf?.to ?? conf
  if (typeof by === FUN) {
    if (typeof to === FUN) {
      yield* filterMappedIndexed(crostab, conf)
    } else {
      yield* filterIndexed(crostab, by)
    }
  } else {
    if (typeof to === FUN) {
      yield* mappedIndexed(crostab)
    } else {
      yield* simpleIndexed(crostab)
    }
  }
}

export function* simpleIndexed(crostab) {
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    yield [side[i], head[j], rows[i][j]]
}

export function* filterIndexed(crostab, filter) {
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    if (filter(side[i], head[j], rows[i][j]))
      yield [side[i], head[j], rows[i][j]]
}

export function* mappedIndexed(crostab, mapper) {
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    yield mapper(side[i], head[j], rows[i][j])
}

export function* filterMappedIndexed(crostab, { by, to }) {
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    if (by(side[i], head[j], rows[i][j]))
      yield to(side[i], head[j], rows[i][j])
}