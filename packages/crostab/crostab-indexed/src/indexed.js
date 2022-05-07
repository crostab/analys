import { FUN } from '@typen/enum-data-types'

export function* indexedOf(crostab) {
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    yield [ side[i], head[j], rows[i][j] ]
}

export function* indexedBy(crostab, by) {
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    if (by(side[i], head[j], rows[i][j]))
      yield [ side[i], head[j], rows[i][j] ]
}

export function* indexedTo(crostab, to) {
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    yield to(side[i], head[j], rows[i][j])
}

export function* indexed(crostab, by, to) {
  if (!by && !to) return yield* indexedOf(crostab)
  if (!to) return yield* indexedBy(crostab, by)
  const { side, head, rows } = crostab
  const h = side?.length, w = head?.length
  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++)
    if (by(side[i], head[j], rows[i][j]))
      yield to(side[i], head[j], rows[i][j])
}

/**
 *
 * @param {CrosTab|CrostabObject} crostab
 * @param {function|{by:function,to:function}} [conf]
 * @returns {Generator<*, void, *>}
 */
export function* indexedVia(crostab, conf) {
  const by = conf?.by, to = conf?.to ?? conf
  yield* typeof by === FUN
    ? typeof to === FUN ? indexed(crostab, by, to) : indexedBy(crostab, by)
    : typeof to === FUN ? indexedTo(crostab) : indexedOf(crostab)
}
