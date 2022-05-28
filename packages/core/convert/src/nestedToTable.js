import { Table }   from '@analys/table'
import { indexed } from '@vect/nested'

export const nestedToTable = (nested, {head, title, by, to}) => {
  return Table.from({
    head: head,
    rows: [ ...indexed(nested, by, to) ],
    title: title
  })
}