/**
 * 对included的施行replant
 * @param {Table} table
 * @param includes
 * @param excludes
 * @param replant
 */
export const tableReplant = (
  table, {
    includes,
    excludes,
    replant,
  }) => {
  const [excl, incl] = [table.select(includes), table.deleteColumns(excludes)]
  replant(incl)
  return acquireTable(excl, incl)
}

const acquireTable = (ta, tb) => {
  acquire(ta.head, tb.head)
  zipper(ta.rows, tb.rows, (va, vb) => acquire(va, vb))
  return ta
}
