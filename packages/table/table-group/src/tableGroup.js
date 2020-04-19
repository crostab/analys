import { Chips }                    from '@analys/chips'
import { Group }                    from '@analys/group'
import { tableFind }                from '@analys/table-find'
import { slice }                    from '@analys/table-init'
import { parseField, parseKeyOnce } from '@analys/tablespec'
import { isMatrix }                 from '@vect/matrix'
import { acquire }                 from '@vect/vector-merge'

export const tableGroup = function ({
  key,
  field,
  filter,
  alias,
} = {}) {
  const table = slice(this)
  if (filter) { tableFind.call(table, filter) }
  const { head, rows } = table
  let groupHead, label, pick, mode;
  ([key, pick] = parseKeyOnce(key))
  const groupingEngine = isMatrix(field = parseField(field, key)) // field |> deco |> says['parsed field']
    ? (groupHead = acquire([key], field.map(([label]) => label)),
        new Group(
          [head.indexOf(key), pick],
          field.map(([label, mode]) => [head.indexOf(label), mode]))
    )
    : ([label, mode] = field, groupHead = [key, label],
        new Chips(
          [head.indexOf(key), pick],
          [head.indexOf(label), mode])
    )
  if (alias) {
    if (!Array.isArray(alias)) alias = Object.entries(alias)
    for (let [field, proj] of alias) {
      const i = groupHead.indexOf(field)
      if (i > 0) groupHead[i] = proj
    }
  }
  return { head: groupHead, rows: groupingEngine.record(rows).toRows() }
}
