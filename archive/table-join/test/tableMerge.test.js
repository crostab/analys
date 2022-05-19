import { UNION }     from '@analys/enum-join-modes'
import { Table }     from '@analys/table'
import { decoTable } from '@spare/logger'
import { says }      from '@spare/xr'
import { merge }     from '../src/tableMerge'

const REGULAR = Table.from({
  head: [ 'glyph', 'reg.l', 'reg.r' ],
  rows: [
    [ 'a', 10, 10 ],
    [ 'b', 10, 10 ],
    [ 'c', 10, 10 ],
  ],
  title: 'reg'
})
const MEDIUM = Table.from({
  head: [ 'glyph', 'med.l', 'med.r' ],
  rows: [
    [ 'A', 8, 8 ],
    [ 'B', 8, 8 ],
    [ 'C', 8, 8 ],
  ],
  title: 'med'
})
const BOLD = Table.from({
  head: [ 'glyph', 'bd.l', 'bd.r' ],
  rows: [
    [ 'a', 6, 6 ],
    [ 'b', 6, 6 ],
    [ 'c', 6, 6 ],
    [ 'd', 6, 6 ],
    [ 'A', 6, 6 ],
    [ 'B', 6, 6 ],
    [ 'C', 6, 6 ],
    [ 'D', 6, 6 ],
  ],
  title: 'reg'
})

const config = { fields: [ 'glyph' ], joinType: UNION, fillEmpty: '' }
const table = merge.call(config, REGULAR, MEDIUM, BOLD)
table |> decoTable |> says['merge']