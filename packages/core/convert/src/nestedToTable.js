import { Table }                        from '@analys/table'
import { filterIndexed, simpleIndexed } from '@vect/nested'

export const nestedToTable = (nested, { head, title, filter }) => {
  const enumerator = filter ? filterIndexed(nested, filter) : simpleIndexed(nested)
  return Table.from({
    head: head,
    rows: [ ...enumerator ],
    title: title
  })
}