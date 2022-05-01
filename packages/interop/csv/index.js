import { Crostab } from '@analys/crostab'
import { Table }   from '@analys/table'
import { indexed } from './src/indexed'

export { indexed }

export const csvToTable = (csv, options) => {
  const enumerator = indexed(csv, options)
  const { done, value } = enumerator.next()
  const head = !done ? value : null
  const rows = [ ...enumerator ]
  return head ? Table.from({ head, rows }) : null
}

export const csvToCrostab = (csv, options) => {
  const enumerator = indexed(csv, options)
  const { done, value } = enumerator.next()
  const [ title, ...head ] = !done ? value : null
  const side = [], rows = []
  for (let [ mark, ...row ] of enumerator) {
    side.push(mark)
    rows.push(row)
  }
  return head ? Crostab.from({ side, head, rows, title }) : null
}
