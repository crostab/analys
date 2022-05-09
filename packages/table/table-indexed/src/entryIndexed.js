import { tripletIndexedBy, tripletIndexedOf } from './tripletIndexed'

export function* entryIndexedOf(table, [ k, v ]) {
  const { head, rows } = table, ki = head.indexOf(k), vi = head.indexOf(v)
  for (let row of rows) {
    yield [ row[ki], row[vi] ]
  }
}

export function* entryIndexedBy(table, [ k, v ], by) {
  const { head, rows } = table, ki = head.indexOf(k), vi = head.indexOf(v)
  for (let row of rows) {
    const x = row[ki], y = row[vi]
    if (by(x, y)) yield [ x, y ]
  }
}

export function* entryIndexedTo(table, [ k, v ], to) {
  const { head, rows } = table, ki = head.indexOf(k), vi = head.indexOf(v)
  for (let row of rows) {
    yield to(row[ki], row[vi])
  }
}

/**
 *
 * @param {Table|TableObject} table
 * @param {[*,*]} kv
 * @param {function(*,*):boolean} [by]
 * @param {function(*,*):*} [to]
 * @returns {Generator<*, void, *>}
 */
export function* entryIndexed(table, kv, by, to) {
  if (!to) { return yield* !by ? tripletIndexedOf(table, kv) : tripletIndexedBy(table, kv, by) }
  const { head, rows } = table, ki = head.indexOf(kv[0]), vi = head.indexOf(kv[1])
  for (let row of rows) {
    const x = row[ki], y = row[vi]
    if (by(x, y)) yield to(x, y)
  }
}