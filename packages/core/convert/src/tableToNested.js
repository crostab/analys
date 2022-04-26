/**
 *
 * @param {Table} table
 * @param x
 * @param y
 * @param v
 */
export const tableToNested = (table, { x, y, v }) => {
  const nested = {}
  const xi = table.coin(x), yi = table.coin(y), vi = table.coin(v)
  for (let row of table.rows) {
    x = row[xi]
    y = row[yi]
    v = row[vi];
    (nested[x] ?? (nested[x] = {}))[y] = v
  }
  return nested
}