import { shallow, slice } from '@analys/table-init'
import { tableFilter } from '@analys/table-filter'
import { tableFind } from '@analys/table-find'
import { tableDivide } from '@analys/table-divide'
import { pivotDev, pivotEdge } from '@analys/table-pivot'
import { lookup, lookupCached, lookupMany, lookupTable } from '@analys/table-lookup'
import { keyedColumnsToSamples, selectKeyedColumns, selectSamplesByHead } from '@analys/keyed-columns'
import { StatMx } from 'borel'
import { NUM_ASC } from '@aryth/comparer'
import { Distinct as DistinctOnColumn, DistinctCount as DistinctCountOnColumn } from '@aryth/distinct-column'
import { size, transpose } from '@vect/matrix'
import { iterate, mapper } from '@vect/vector-mapper'
import { splices } from '@vect/vector-update'
import { mapper as mapperMatrix } from '@vect/matrix-mapper'
import { mutate as mutateColumn } from '@vect/column-mapper'
import { column } from '@vect/column-getter'
import {
  pop as popColumn,
  push as pushColumn,
  shift as shiftColumn,
  splices as splicesColumns,
  unshift as unshiftColumn
} from '@vect/columns-update'
import { tableChips } from '@analys/table-chips'
import { inferTypes } from '@analys/table-types'

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
   * @param {*|[*,*]} [headFields]
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
  columnIndexes (fields) { return fields.map(this.coin, this) }
  column (field) { return column(this.rows, this.coin(field), this.ht) }
  setColumn (field, column) { return mutateColumn(this.rows, this.coin(field), (_, i) => column[i], this.ht), this }
  mutateColumn (field, fn) { return mutateColumn(this.rows, this.coin(field), (x, i) => fn(x, i), this.ht), this }

  pushRow (row) { return this.rows.push(row), this }
  unshiftRow (row) { return this.rows.unshift(row), this }
  pushColumn (label, column) { return this.head.push(label), pushColumn(this.rows, column), this }
  unshiftColumn (label, column) { return this.head.unshift(label), unshiftColumn(this.rows, column), this }
  popRow () { return this.rows.pop() }
  shiftRow () { return this.rows.shift() }
  popColumn () { return popColumn(this.rows) }
  shiftColumn () { return shiftColumn(this.rows) }

  map (fn, { mutate = true } = {}) {
    return this.boot({ rows: mapperMatrix(this.rows, fn, this.ht, this.wd) }, mutate)
  }
  mapHead (fn, { mutate = true } = {}) { return this.boot({ head: mapper(this.head, fn) }, mutate) }

  lookupOne (valueToFind, key, field, cached = true) {
    return (cached ? lookupCached : lookup).call(this, valueToFind, key, field)
  }
  lookupMany (valuesToFind, key, field) { return lookupMany.call(this, valuesToFind, key, field) }
  lookupTable (key, field, objectify) { return lookupTable.call(this, key, field, objectify) }

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
   * @param {*} label
   * @param {*[]} column
   * @param {*} field - next to the field, will the new column (label, column) be inserted
   * @param afterField
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */
  insertColumn (label, column, { field, mutate = false } = {}) {
    const o = mutate ? this : this |> shallow, index = this.coin(field) + 1
    o.head.splice(index, 0, label)
    iterate(o.rows, (row, i) => row.splice(index, 0, column[i]))
    return mutate ? this : Table.from(o)
  }

  /**
   *
   * @param {*} field
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */
  deleteColumn (field, { mutate = false } = {}) {
    const o = mutate ? this : this |> shallow, index = this.coin(field)
    o.head.splice(index, 1)
    o.rows.forEach(row => row.splice(index, 1))
    return mutate ? this : Table.from(o)
  }

  /**
   *
   * @param {*[]|[*,*][]} fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */
  spliceColumns (fields, { mutate = false } = {}) {
    const o = mutate ? this : this |> shallow, indexes = this.columnIndexes(fields).sort(NUM_ASC)
    splicesColumns(o.rows, indexes), splices(o.head, indexes)
    return mutate ? this : Table.from(o)
  }

  divide (fields, { mutate = false } = {}) {
    const o = mutate ? this : this |> shallow
    const { pick, rest } = tableDivide.call(o, fields)
    return { pick: Table.from(pick), rest: mutate ? this : Table.from(rest) }
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
   * @param {Object<*,function(*?):boolean>} filter
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
   * @param {*} field
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
   * @param {Object} options
   * @param {*} options.key
   * @param {*} [options.field]
   * @param {number} [options.mode=ACCUM] - MERGE, ACCUM, INCRE, COUNT
   * @param {boolean} [options.objectify=true]
   * @return {[*,*][]|{}}
   */
  chips (options = {}) { return tableChips.call(this, options)}

  /**
   * @param {Object} options
   * @param {*} options.side
   * @param {*} options.banner
   * @param {*} [options.field]
   * @param {Object<*,function(*?):boolean>} [options.filter]
   * @param {function(...*):number} [options.formula] - formula is valid only when cell is CubeCell array.
   * @returns {CrosTab}
   */
  crosTab (options = {}) { return pivotEdge(this, options) }

  /**
   *
   * @param {*} side
   * @param {*} banner
   * @param {CubeCell[]|CubeCell} [cell]
   * @param {Filter[]|Filter} [filter]
   * @param {function():number} formula - formula is valid only when cell is CubeCell array.
   * @deprecated Please use Table.crosTab instead.
   * @returns {CrosTab}
   */
  crosTabDev ({
    side,
    banner,
    cell,
    filter,
    formula
  }) { return pivotDev(this, { side, banner, cell, filter, formula }) }

  inferTypes ({ inferType, omitNull = true, mutate = false } = {}) {
    const types = inferTypes.call(this, { inferType, omitNull })
    if (mutate) this.types = types
    return types
  }

  /** @returns {Table} */
  boot ({ types, head, rows } = {}, mutate) {
    if (mutate) {
      if (head) this.head = head
      if (rows) this.rows = rows
      if (types) this.types = types
      return this
    }
    else {
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
  from (AeroEngineSpecs) {
    return undefined
  }
}


