import { selectKeyedRows, selectSamplesBySide, sortKeyedRows, sortRowsByKeys } from '@analys/keyed-rows'
import { selectKeyedColumns, selectSamplesByHead, sortColumnsByKeys, sortKeyedColumns } from '@analys/keyed-columns'
import {
  hlookup,
  hlookupCached,
  hlookupMany,
  hlookupTable,
  vlookup,
  vlookupCached,
  vlookupMany,
  vlookupTable
} from '@analys/crostab-lookup'
import { shallow, slice } from '@analys/crostab-init'
import { NUM_ASC, STR_ASC } from '@aryth/comparer'
import { COLUMNWISE, ROWWISE } from '@vect/enum-matrix-directions'
import { transpose } from '@vect/matrix-transpose'
import { mapper, mutate } from '@vect/vector-mapper'
import { zipper } from '@vect/vector-zipper'
import { init as initMatrix } from '@vect/matrix-init'
import { mapper as mapperMatrix } from '@vect/matrix-mapper'
import { mutate as mutateColumn } from '@vect/column-mapper'
import { column } from '@vect/column-getter'
import {
  pop as popColumn,
  push as pushColumn,
  shift as shiftColumn,
  unshift as unshiftColumn
} from '@vect/columns-update'
import { pair } from '@vect/object-init'

/**
 *
 */
export class CrosTab {
  /** @type {*[]} */ side
  /** @type {*[]} */ head
  /** @type {*[][]} */ rows
  /** @type {string} */ title

  /**
   *
   * @param {*[]} side
   * @param {*[]} head
   * @param {*[][]} rows
   * @param {string} [title]
   */
  constructor (side, head, rows, title) {
    this.side = side
    this.head = head
    this.rows = rows
    this.title = title || ''
  }

  static from (o) {
    return new CrosTab(o.side, o.head || o.banner, o.rows || o.matrix, o.title)
  }

  /**
   * Shallow copy
   * @param {*[]} side
   * @param {*[]} head
   * @param {function(number,number):*} func
   * @param {string} [title]
   * @return {CrosTab}
   */
  static init ({ side, head, func, title }) {
    const rows = initMatrix(side?.length, head?.length, (x, y) => func(x, y))
    return CrosTab.from({ side, head, rows, title })
  }

  rowwiseSamples (headFields, indexed = false, indexName = '_') {
    const samples = selectSamplesByHead.call(this, headFields)
    return indexed ? zipper(this.side, samples, (l, s) => Object.assign(pair(indexName, l), s)) : samples
  }
  columnwiseSamples (sideFields, indexed = false, indexName = '_') {
    const samples = selectSamplesBySide.call(this, sideFields)
    return indexed ? zipper(this.head, samples, (l, s) => Object.assign(pair(indexName, l), s)) : samples
  }
  toJson (mutate = false) { return mutate ? this |> slice : this |> shallow }

  /** @returns {*[][]} */
  get columns () { return transpose(this.rows) }
  get size () { return [this.ht, this.wd] }
  get ht () { return this.side?.length }
  get wd () { return this.head?.length }
  roin (r) { return this.side.indexOf(r) }
  coin (c) { return this.head.indexOf(c) }
  cell (r, c) { return this.element(this.roin(r), this.coin(c)) }
  element (x, y) {
    const row = this.rows[x]
    return row ? row[y] : undefined
  }
  coordinate (r, c) { return { x: this.roin(r), y: this.coin(c) } }
  row (r) { return this.rows[this.roin(r)] }
  column (c) { return column(this.rows, this.coin(c), this.ht) }
  transpose (title, { mutate = true } = {}) {
    const { head: side, side: head, columns: rows } = this
    return this.boot({ side, head, rows, title }, mutate)
  }
  setRow (r, row) { return this.rows[this.roin(r)] = row, this }
  setRowBy (r, fn) { return mutate(this.row(r), fn, this.wd), this }
  setColumn (c, column) { return mutateColumn(this.rows, this.coin(c), (_, i) => column[i], this.ht), this }
  setColumnBy (c, fn) { return mutateColumn(this.rows, this.coin(c), fn, this.ht), this }

  map (fn, { mutate = true } = {}) {
    return this.boot({ rows: mapperMatrix(this.rows, fn, this.ht, this.wd) }, mutate)
  }
  mapSide (fn, { mutate = true } = {}) { return this.boot({ side: mapper(this.side, fn) }, mutate) }
  mapBanner (fn, { mutate = true } = {}) { return this.boot({ head: mapper(this.head, fn) }, mutate) }

  pushRow (label, row) { return this.side.push(label), this.rows.push(row), this }
  unshiftRow (label, row) { return this.side.unshift(label), this.rows.unshift(row), this }
  pushColumn (label, col) { return this.head.push(label), pushColumn(this.rows, col), this }
  unshiftColumn (label, col) { return this.head.unshift(label), unshiftColumn(this.rows, col), this }
  popRow () { return this.rows.pop() }
  shiftRow () { return this.rows.shift() }
  popColumn () { return popColumn(this.rows) }
  shiftColumn () { return shiftColumn(this.rows) }

  slice ({ top, bottom, left, right, mutate = true } = {}) {
    let { side, head, rows } = this
    if (top || bottom) side = side.slice(top, bottom), rows = rows.slice(top, bottom)
    if (left || right) head = head.slice(left, right), rows = rows.map(row => row.slice(left, right))
    return this.boot({ side, head, rows }, mutate)
  }

  vlookupOne (valueToFind, keyField, valueField, cached) {
    return (cached ? vlookupCached : vlookup).call(this, valueToFind, keyField, valueField)
  }
  vlookupMany (valuesToFind, keyField, valueField) { return vlookupMany.call(this, valuesToFind, keyField, valueField) }
  vlookupTable (keyField, valueField) { return vlookupTable.call(this, keyField, valueField) }

  hlookupOne (valueToFind, keyField, valueField, cached) {
    return (cached ? hlookupCached : hlookup).call(this, valueToFind, keyField, valueField)
  }
  hlookupMany (valuesToFind, keyField, valueField) { return hlookupMany.call(this, valuesToFind, keyField, valueField) }
  hlookupTable (keyField, valueField) { return hlookupTable.call(this, keyField, valueField) }

  selectRows (sideLabels, mutate = false) {
    let o = mutate ? this : this |> slice
    selectKeyedRows.call(o, sideLabels)
    return mutate ? this : this.copy(o)
  }

  selectColumns (headLabels, mutate = false) {
    let o = mutate ? this : this |> slice
    selectKeyedColumns.call(this, headLabels)
    return mutate ? this : this.copy(o)
  }

  select ({ side, head, mutate = false } = {}) {
    let o = mutate ? this : this |> slice
    if (head?.length) selectKeyedColumns.call(o, head)
    if (side?.length) selectKeyedRows.call(o, side)
    return mutate ? this : this.copy(o)
  }

  sort ({ direct = ROWWISE, field, comparer = NUM_ASC, mutate = false } = {}) {
    let o = mutate ? this : this |> slice
    if (direct === ROWWISE) sortKeyedRows.call(o, comparer, this.coin(field))
    if (direct === COLUMNWISE) sortKeyedColumns.call(o, comparer, this.roin(field))
    return mutate ? this : this.copy(o)
  }
  sortByLabels ({ direct = ROWWISE, comparer = STR_ASC, mutate = false }) {
    let o = mutate ? this : this |> slice
    if (direct === ROWWISE) sortRowsByKeys.call(o, comparer)
    if (direct === COLUMNWISE) sortColumnsByKeys.call(o, comparer)
    return mutate ? this : this.copy(o)
  }

  boot ({ side, head, rows, title } = {}, mutate) {
    if (mutate) {
      if (side) this.side = side
      if (head) this.head = head
      if (rows) this.rows = rows
      if (title) this.title = title
      return this
    } else {
      return this.copy({ side, head, rows, title })
    }
  }

  copy ({ side, head, rows, title } = {}) {
    if (!side) side = this.side.slice()
    if (!head) head = this.head.slice()
    if (!rows) rows = this.rows.map(row => row.slice())
    if (!title) title = this.title
    return new CrosTab(side, head, rows, title)
  }
}
