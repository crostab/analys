import { slice, shallow } from '@analys/table-init'
import { tableFilter } from '@analys/table-filter'
import { tableFind } from '@analys/table-find'
import { pivotDev, pivotEdge } from '@analys/table-pivot'
import { StatMx } from 'borel'
import { NUM_ASC } from '@aryth/comparer'
import { size, transpose } from '@vect/matrix'
import { mapper } from '@vect/vector-mapper'
import { splices } from '@vect/vector-update'
import { mapper as mapperMatrix } from '@vect/matrix-mapper'
import { mutate as mutateColumn } from '@vect/column-mapper'
import { column } from '@vect/column-getter'
import {
  keyedColumnsToSamples, selectKeyedColumns, selectSamplesByHead
} from '@analys/keyed-columns'
import {
  Distinct as DistinctOnColumn, DistinctCount as DistinctCountOnColumn
} from '@aryth/distinct-column'
import {
  push as pushColumn, pop as popColumn, shift as shiftColumn, unshift as unshiftColumn, splices as splicesColumns
} from '@vect/columns-update'

export class Table {
  /** @type {*[]} */ head
  /** @type {*[][]} */ rows
  /** @type {string} */ title
  /** @type {string[]} */ types

  /**
   * @param {*[]} [head]
   * @param {*[][]} [rows]
   * @param {string} [title]
   * @param {string[]} [types]
   */
  constructor (head, rows, title, types) {
    this.head = head || []
    this.rows = rows || [[]]
    this.title = title || ''
    this.types = types
  }

  static from (o) { return new Table(o.head || o.banner, o.rows || o.matrix, o.title, o.types) }

  /**
   *
   * @param {str|[*,*]} [headFields]
   * @returns {Object[]}
   */
  toSamples (headFields) {
    return headFields
      ? selectSamplesByHead.call(this, headFields)
      : keyedColumnsToSamples.call(this)
  }

  /**
   *
   * @param {boolean} [mutate=false]
   * @returns {*}
   */
  toJson (mutate = false) { return mutate ? this |> slice : this |> shallow }

  get size () { return size(this.rows) }
  get ht () { return this.rows?.length }
  get wd () { return this.head?.length }
  get columns () { return transpose(this.rows) }
  cell (x, field) {
    const row = this.rows[x]
    return row ? row[this.coin(field)] : undefined
  }
  coin (field) { return this.head.indexOf(field) }
  columnIndexes (fields) {return fields.map(field => this.coin(field))}
  column (field) { return column(this.rows, this.coin(field), this.ht) }
  setColumn (field, column) { return mutateColumn(this.rows, this.coin(field), (_, i) => column[i], this.ht), this }
  mutateColumn (field, fn) { return mutateColumn(this.rows, this.coin(field), (x, i) => fn(x, i), this.ht), this }

  pushRow (row) { return this.rows.push(row), this }
  unshiftRow (row) { return this.rows.unshift(row), this }
  pushColumn (label, col) { return this.head.push(label), pushColumn(this.rows, col), this }
  unshiftColumn (label, col) { return this.head.unshift(label), unshiftColumn(this.rows, col), this }
  popRow () { return this.rows.pop() }
  shiftRow () { return this.rows.shift() }
  popColumn () { return popColumn(this.rows) }
  shiftColumn () { return shiftColumn(this.rows) }

  map (fn, { mutate = true } = {}) {
    return this.boot({ rows: mapperMatrix(this.rows, fn, this.ht, this.wd) }, mutate)
  }
  mapHead (fn, { mutate = true } = {}) { return this.boot({ head: mapper(this.head, fn) }, mutate) }

  /**
   *
   * @param {*[]|[*,*][]} fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */
  select (fields, { mutate = false } = {}) {
    let o = mutate ? this : this |> slice
    selectKeyedColumns.call(o, fields)
    return mutate ? this : this.copy(o)
  }

  /**
   *
   * @param {*[]|[*,*][]} fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */
  spliceColumns (fields, { mutate = false } = {}) {
    const ys = fields.map(this.coin.bind(this)).sort(NUM_ASC)
    const o = mutate ? this : this |> shallow
    splicesColumns(o.rows, ys), splices(o.head, ys)
    return mutate ? this : Table.from(o)
  }

  /**
   *
   * @param {Object|Filter[]|Filter} filterCollection
   * @param {boolean} [mutate=true]
   * @return {Table}
   */
  filter (filterCollection, { mutate = true } = {}) {
    const o = mutate ? this : this |> slice
    tableFilter.call(o, filterCollection)
    return mutate ? this : this.copy(o)
  }

  /**
   *
   * @param {Object<str,function(*?):boolean>} filter
   * @param {boolean} [mutate=true]
   * @return {Table}
   */
  find (filter, { mutate = true } = {}) {
    const o = mutate ? this : this |> slice
    tableFind.call(o, filter)
    return mutate ? this : this.copy(o)
  }

  distinct (fields, { mutate = true } = {}) {
    const o = mutate ? this : this |> slice
    for (let field of fields) o.rows = StatMx.distinct(o.rows, this.coin(field))
    return mutate ? this : this.copy(o)
  }

  /**
   *
   * @param {str} field
   * @param {boolean} [count=false]
   * @param {string|boolean} [sort=false] - When sort is function, sort must be a comparer between two point element.
   * @returns {[any, any][]|[]|any[]|*}
   */
  distinctOnColumn (field, { count = false, sort = false } = {}) {
    return count
      ? DistinctCountOnColumn(this.coin(field))(this.rows, { l: this.ht, sort })
      : DistinctOnColumn(this.coin(field))(this.rows, this.ht)
  }

  /**
   *
   * @param field
   * @param comparer
   * @param mutate
   * @returns {Table} - 'this' Table rows is mutated by sort function
   */
  sort (field, comparer, { mutate = true } = {}) {
    const y = this.coin(field)
    const rowComparer = (a, b) => comparer(a[y], b[y])
    const o = mutate ? this : this |> slice
    o.rows.sort(rowComparer)
    return mutate ? this : this.copy(o)
  }

  /**
   *
   * @param {function(*,*):number} comparer - Comparer of head elements
   * @param {boolean} mutate
   * @returns {Table|*}
   */
  sortLabel (comparer, { mutate = true } = {}) {
    let o = mutate ? this : this |> slice
    sortColumnsByKeys.call(o, comparer)
    return mutate ? this : this.copy(o)
  }

  /**
   *
   * @param {str} side
   * @param {str} banner
   * @param {*} [field]
   * @param {Object<str,function(*?):boolean>} [filter]
   * @param {function(...*):number} [formula] - formula is valid only when cell is CubeCell array.
   * @returns {CrosTab}
   */
  crosTab ({
    side,
    banner,
    field,
    filter,
    formula
  }) { return pivotEdge(this, { side, banner, field, filter, formula }) }

  /**
   *
   * @param {str} side
   * @param {str} banner
   * @param {CubeCell[]|CubeCell} [cell]
   * @param {Filter[]|Filter} [filter]
   * @param {function():number} formula - formula is valid only when cell is CubeCell array.
   * @returns {CrosTab}
   */
  crosTabDev ({
    side,
    banner,
    cell,
    filter,
    formula
  }) { return pivotDev(this, { side, banner, cell, filter, formula }) }

  /** @returns {Table} */
  boot ({ types, head, rows } = {}, mutate) {
    if (mutate) {
      if (head) this.head = head
      if (rows) this.rows = rows
      if (types) this.types = types
      return this
    } else {
      return this.copy({ types, head, rows })
    }
  }

  /** @returns {Table} */
  copy ({ types, head, rows } = {}) {
    if (!head) head = this.head.slice()
    if (!rows) rows = this.rows.map(row => row.slice())
    if (!types) types = this.types?.slice()
    return new Table(head, rows, this.title, types)
  }
}
