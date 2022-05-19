export function* tripletIndexedOf(table, xyz) {
  const { head, rows } = table, [ xi, yi, zi ] = xyz.map(x => head.indexOf(x))
  for (let row of rows) {
    yield [ row[xi], row[yi], row[zi] ]
  }
}

export function* tripletIndexedBy(table, xyz, by) {
  const { head, rows } = table, [ xi, yi, zi ] = xyz.map(x => head.indexOf(x))
  for (let row of rows) {
    const x = row[xi], y = row[yi], z = row[zi]
    if (by(x, y, z)) yield [ x, y, z ]
  }
}

export function* tripletIndexedTo(table, xyz, to) {
  const { head, rows } = table, [ xi, yi, zi ] = xyz.map(x => head.indexOf(x))
  for (let row of rows) {
    yield to(row[xi], row[yi], row[zi])
  }
}

/**
 *
 * @param {Table|TableObject} table
 * @param {[*,*,*]} xyz
 * @param {function(*,*,*):boolean} [by]
 * @param {function(*,*,*):*} [to]
 * @returns {Generator<*, void, *>}
 */
export function* tripletIndexed(table, xyz, by, to) {
  if (!to) { return yield* !by ? tripletIndexedOf(table, xyz) : tripletIndexedBy(table, xyz, by) }
  const { head, rows } = table, [ xi, yi, zi ] = xyz.map(x => head.indexOf(x))
  for (let row of rows) {
    const x = row[xi], y = row[yi], z = row[zi]
    if (by(x, y, z)) yield to(x, y, z)
  }
}