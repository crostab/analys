import { clone, Mx } from 'veho'
import { NUM_ASC, STR_ASC } from '@aryth/comparer'
import { mapper, mutate } from '@vect/vector-mapper'
import { zipper } from '@vect/vector-zipper'
import { transpose, ROWWISE, COLUMNWISE } from '@vect/matrix'
import { init as initMatrix } from '@vect/matrix-init'
import { mapper as mapperMatrix } from '@vect/matrix-mapper'
import { mutate as mutateColumn } from '@vect/column-mapper'
import { column } from '@vect/column-getter'
import {
  push as pushColumn, pop as popColumn, shift as shiftColumn, unshift as unshiftColumn
} from '@vect/columns-update'
import { selectKeyedRows } from '../../keyed-rows/src/selectKeyedRows'
import { selectKeyedColumns } from '../../keyed-columns/src/selectKeyedColumns'
import { sortKeyedRows, sortRowsByKeys } from '@analys/keyed-rows/src/sortKeyedRows'
import { sortColumnsByKeys, sortKeyedColumns } from '@analys/keyed-columns/src/sortKeyedColumns'
import { selectSamplesByHead } from '@analys/keyed-columns'
import { selectSamplesBySide } from '@analys/keyed-rows'
import { ob } from '../utils/addIndex'

/**
 * A number, or a string containing a number.
 * @typedef {(number|string)} str
 * @typedef {{field:str,mode:number,filter:}} CubeCell
 * @typedef {{field:str,filter:function(*):boolean}} Filter
 * @typedef {{
 *  side:string,
 *  head:string,
 *  filter:Filter[]|Filter,
 *  cell:CubeCell[]|CubeCell,
 *  formula:function():number,
 * }} TableSpec
 */

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

  static from (ob) {
    const side = ob.side, head = ob.head || ob.banner || [], rows = ob.rows || ob.matrix || [[]], title = ob.title || ''
    return new CrosTab(side, head, rows, title)
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
    return indexed ? zipper(this.side, samples, (l, s) => Object.assign(ob(indexName, l), s)) : samples
  }
  columnwiseSamples (sideFields, indexed = false, indexName = '_') {
    const samples = selectSamplesBySide.call(this, sideFields)
    return indexed ? zipper(this.head, samples, (l, s) => Object.assign(ob(indexName, l), s)) : samples
  }
  get toJson () {
    return {
      side: this.side.slice(),
      head: this.head.slice(),
      rows: this.rows |> clone,
      title: this.title
    }
  }

  /** @returns {*[][]} */
  get columns () { return transpose(this.rows) }
  get size () { return [this.ht, this.wd] }
  get ht () { return this.side?.length }
  get wd () { return this.head?.length }
  roin (r) { return this.side.indexOf(r) }
  coin (c) { return this.head.indexOf(c) }
  cell (r, c) { return (r = this.row(this.roin(r))) ? r[this.coin(c)] : null }
  element (x, y) { return this.rows[x][y] }
  coordinate (r, c) { return { x: this.roin(r), y: this.coin(c) } }
  row (r) { return this.rows[this.roin(r)] }
  column (c) { return column(this.rows, this.coin(c), this.ht) }
  transpose (newTitle, { mutate = true } = {}) {
    const { head: side, side: head, columns: rows } = this
    return this.boot(mutate, { rows, side, head })
  }
  setRow (r, row) { return this.rows[this.roin(r)] = row, this }
  setRowBy (r, fn) { return mutate(this.row(r), fn, this.wd), this }
  setColumn (c, column) { return mutateColumn(this.rows, this.coin(c), (_, i) => column[i], this.ht), this }
  setColumnBy (c, fn) { return mutateColumn(this.rows, this.coin(c), fn, this.ht), this }

  map (fn, { mutate = true } = {}) {
    return this.boot(mutate, { rows: mapperMatrix(this.rows, fn, this.ht, this.wd) })
  }
  mapSide (fn, { mutate = true } = {}) { return this.boot(mutate, { side: mapper(this.side, fn) }) }
  mapBanner (fn, { mutate = true } = {}) { return this.boot(mutate, { head: mapper(this.head, fn) }) }

  pushRow (label, row) { return this.side.push(label), this.rows.push(row), this }
  unshiftRow (label, row) { return this.side.unshift(label), this.rows.unshift(row), this }
  pushColumn (label, col) { return this.head.push(label), pushColumn(this.rows, col), this }
  unshiftColumn (label, col) { return this.head.unshift(label), unshiftColumn(this.rows, col), this }
  popRow () { return this.rows.pop() }
  shiftRow () { return this.rows.shift() }
  popColumn () { return popColumn(this.rows) }
  shiftColumn () { return shiftColumn(this.rows) }

  selectRows (sideLabels, mutate = false) {
    const { side, rows } = selectKeyedRows.call(this, sideLabels)
    return this.boot(mutate, { side, rows })
  }
  selectColumns (headLabels, mutate = false) {
    const { head, rows } = selectKeyedColumns.call(this, headLabels)
    return this.boot(mutate, { head, rows })
  }
  select ({ side: sls, head: bls, mutate = false } = {}) {
    let { rows, side, head } = this
    if (bls?.length) ({ head, rows } = selectKeyedColumns.call({ head, rows }, bls))
    if (sls?.length) ({ side, rows } = selectKeyedRows.call({ side, rows }, sls))
    return this.boot(mutate, { rows, side, head })
  }

  slice ({ top, bottom, left, right, mutate = true } = {}) {
    let { side: s, head: b, rows: mx } = this
    if (top || bottom) s = s.slice(top, bottom), mx = mx.slice(top, bottom)
    if (left || right) b = b.slice(left, right), mx = mx.map(row => row.slice(left, right))
    return this.boot(mutate, { rows: mx, side: s, head: b })
  }
  sort ({ direct = ROWWISE, field, comparer = NUM_ASC, mutate = false } = {}) {
    let { side, head, rows } = this
    if (direct === ROWWISE) ({ side, rows } = sortKeyedRows.call({ side, rows }, comparer, this.coin(field)))
    if (direct === COLUMNWISE) ({ head, rows } = sortKeyedColumns.call({ head, rows }, comparer, this.roin(field)))
    return this.boot(mutate, { rows, side, head })
  }
  sortByLabels ({ direct = ROWWISE, comparer = STR_ASC, mutate = false }) {
    let { side, head, rows } = this
    if (direct === ROWWISE) ({ side, rows } = sortRowsByKeys.call({ side, rows }, comparer))
    if (direct === COLUMNWISE) ({ head, rows } = sortColumnsByKeys.call({ head, rows }, comparer))
    return this.boot(mutate, { rows, side, head })
  }

  boot (mutate, { rows, side, head } = {}) {
    return (mutate) ? this.reboot(rows, side, head) : this.clone(rows, side, head)
  }
  /**
   *
   * @param {*[][]} [rows]
   * @param {*[]} [side]
   * @param {*[]} [head]
   * @returns {CrosTab}
   */
  reboot (rows, side, head) {
    if (rows) this.rows = rows
    if (side) this.side = side
    if (head) this.head = head
    return this
  }
  /**
   * Shallow copy
   * @param {*[][]} [rows]
   * @param {*[]} [side]
   * @param {*[]} [head]
   * @return {CrosTab}
   */
  clone (rows, side, head) {
    return new CrosTab(
      side || this.side.slice(),
      head || this.head.slice(),
      rows || Mx.clone(this.rows),
      this.title
    )
  }
}
