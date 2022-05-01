import { Crostab } from '@analys/crostab'
import { Table }   from '@analys/table'
import { indexed } from './src/indexed'

export { indexed }

export const csvToTable = (csv, options) => {
  const enumerator = indexed(csv, options)
  const { done, value: head } = enumerator.next()
  if (done) return null
  return Table.from({ head, rows: [ ...enumerator ] })
}

export const csvToCrostab = (csv, options) => {
  const enumerator = indexed(csv, options)
  const { done, value } = enumerator.next()
  if (done) return null
  const [ title, ...head ] = value
  const side = [], rows = []
  for (let [ mark, ...row ] of enumerator) {
    side.push(mark)
    rows.push(row)
  }
  return Crostab.from({ side, head, rows, title })
}
