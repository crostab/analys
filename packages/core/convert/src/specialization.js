import { acquire } from '@vect/vector-algebra'
import { zipper }  from '@vect/vector-zipper'


export const crostabToTable = (crostab, title) => {
  const head = acquire([ title ?? crostab.title ?? '' ], crostab.head)
  const rows = zipper(crostab.side, crostab.rows, (x, row) => acquire([ x ], row))
  return { head, rows }
}

export const tableToMatrix = table => {
  const { head, rows } = table
  return acquire([ head ], rows)
}

export const crostabToMatrix = (crostab, title) => {
  return crostabToTable(crostab, title) |> tableToMatrix
}