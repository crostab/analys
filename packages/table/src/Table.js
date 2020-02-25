import { Mx, Samples } from 'veho'
import { StatMx } from 'borel'
import { sortKeyedVectors } from '@analys/util-pivot'
import { tablePivot } from '@analys/table-pivot'
import { Distinct as DistinctOnColumn, DistinctCount as DistinctCountOnColumn } from '@aryth/distinct-column'
import { NUM_ASC } from '@aryth/comparer'
import { mapper } from '@vect/vector-mapper'
import { splices } from '@vect/vector-update'
import { unwind } from '@vect/entries-unwind'
import { size, transpose } from '@vect/matrix'
import { mapper as mapperMatrix } from '@vect/matrix-mapper'
import { mutate as mutateColumn } from '@vect/column-mapper'
import { select as selectColumn } from '@vect/columns-select'
import { mapper as mapperColumns } from '@vect/columns-mapper'
import {
  push as pushColumn, pop as popColumn, shift as shiftColumn, unshift as unshiftColumn,
  splices as splicesColumns
} from '@vect/columns-update'
import { wind as windOb, initByValues as initOb } from '@vect/object-init'
import { parserSelector } from '../utils/parserSelector'
import { inferArrayType } from '../utils/inferArrayType'

/**
 *
 */
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

  /**
   *
   * @param {*[]} [head]
   * @param {*[][]} [rows]
   * @param {string} [title]
   * @param {string[]} [types]
   * @return {Table}
   */
  static build ({ head, rows, title, types }) {
    return new Table(head, rows, title, types)
  }

  /**
   *
   * @param {str|[*,*]} [field]
   * @returns {[str,number]}
   */
  lookUpFieldIndex (field) {
    if (!Array.isArray(field)) return [field, this.coin(field)]
    let [currField, newField] = field
    return [newField, this.coin(currField)]
  }

  /**
   *
   * @param {(str|[*,*])[]} fields
   * @returns {[str,number][]}
   */
  lookUpFieldIndexes (fields) { return mapper(fields, field => this.lookUpFieldIndex(field)) }

  /**
   *
   * @param {str|[*,*]} [fields]
   * @returns {Object<*, *>[]}
   */
  toSamples (fields) {
    if (!fields?.length) return this.rows.map(row => windOb(this.head, row))
    const fieldToIndexEntries = fields.map(this.lookUpFieldIndex.bind(this))
    return this.rows.map(row => initOb(fieldToIndexEntries, i => row[i]))
  }

  /**
   *
   * @param {boolean} [mutate=true]
   * @returns {*}
   */
  toJson (mutate = true) {
    const { head, rows, title } = this
    return mutate ? { head, rows, title } : {
      head: head.slice(),
      rows: rows |> Mx.clone,
      title: title?.slice()
    }
  }

  /**
   *
   * @param {{}[]} samples
   * @param {*[]|[*,*][]} [fields]
   * @param {string} [title]
   * @param {*[]} [types]
   * @return {Table}
   */
  static fromSamples (samples, { fields, title, types } = {}) {
    const { head, rows } = Samples.toTable(samples, { fields })
    return new Table(head, rows, title, types)
  }

  /**
   *
   * @param {*[]|[*,*][]} fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */
  select (fields, { mutate = true } = {}) {
    if (!fields?.length) return mutate ? this : this.clone()
    const fieldToIndexes = this.lookUpFieldIndexes(fields)
    const { indexes, head } = unwind(fieldToIndexes)
    const rows = selectColumn(this.rows, indexes)
    return this.boot(mutate, { rows, head })
  }

  /**
   *
   * @param {*[]|[*,*][]} fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */
  spliceColumns (fields, { mutate = true } = {}) {
    const ys = fields.map(this.coin.bind(this)).sort(NUM_ASC),
      { rows, head } = this
    return mutate
      ? this.reboot(splicesColumns(rows, ys), splices(head, ys))
      : this.clone(splicesColumns(Mx.copy(rows), ys), splices(head.slice(), ys))
  }

  map (fn, { mutate = true } = {}) {
    return this.boot(mutate, { rows: mapperMatrix(this.rows, fn, this.ht, this.wd) })
  }
  mapBanner (fn, { mutate = true } = {}) {
    return this.boot(mutate, { head: mapper(this.head, fn) })
  }

  get size () { return size(this.rows) }
  get ht () { return this.rows?.length }
  get wd () { return this.head?.length }
  get columns () { return transpose(this.rows) }
  cell (x, field) { return this.rows[x][this.coin(y)] }
  coin (field) { return this.head.indexOf(field) }
  columnIndexes (fields) {return fields.map(field => this.coin(field))}
  column (field) { return this.rows.map(row => row[field = this.coin(field)]) }
  setColumn (field, column) { return mutateColumn(this.rows, this.coin(field), (_, i) => column[i], this.ht), this }
  setColumnBy (field, fn) { return mutateColumn(this.rows, this.coin(field), (x, i) => fn(x, i), this.ht), this }

  pushRow (row) { return this.rows.push(row), this }
  unshiftRow (row) { return this.rows.unshift(row), this }
  pushColumn (label, col) { return this.head.push(label), pushColumn(this.rows, col), this }
  unshiftColumn (label, col) { return this.head.unshift(label), unshiftColumn(this.rows, col), this }
  popRow () { return this.rows.pop() }
  shiftRow () { return this.rows.shift() }
  popColumn () { return popColumn(this.rows) }
  shiftColumn () { return shiftColumn(this.rows) }

  /**
   *
   * Specify the type of a column. No return
   * @param {str} field accept both column name in string or column index in integer
   * @param {string} typeName string | (number, float) | integer | boolean
   */
  changeType (field, typeName) {
    const y = this.coin(field), parser = parserSelector(typeName)
    if (parser) mutateColumn(this.rows, y, parser, this.ht), this.types[y] = typeName
    return this
  }

  /**
   * Re-generate this._types based on DPTyp.inferArr method.
   * Cautious: This method will change all elements of this._types.
   * @return {string[]}
   */
  mutInferTypes () {
    this.types = mapperColumns(this.rows, inferArrayType)
    for (let [i, typeName] of this.types.entries()) {
      if (typeName === 'numstr') { this.changeType(i, 'number') } else
        if (typeName === 'misc') { this.changeType(i, 'string') }
    }
    return this.types
  }

  /**
   *
   * @param {Filter[]|Filter} filterCollection
   * @param {boolean} [mutate=true]
   * @return {Table}
   */
  filter (filterCollection, { mutate = true } = {}) {
    let { rows } = this, j
    if (Array.isArray(filterCollection)) {
      for (let { field, filter } of filterCollection)
        if ((j = this.coin(field)) >= 0)
          rows = rows.filter(row => filter(row[j]))
    } else {
      let { field, filter } = filter
      if ((j = this.coin(field)) >= 0)
        rows = rows.filter(row => filter(row[j]))
    }
    return this.boot(mutate, { rows })
  }

  distinct (fields, { mutate = true } = {}) {
    let { rows } = this
    for (let field of fields)
      rows = StatMx.distinct(rows, this.coin(field))
    return this.boot(mutate, { rows })
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

  sort (field, comparer, { mutate = true } = {}) {
    let y = this.coin(field), comp = (a, b) => comparer(a[y], b[y]), mx
    return mutate
      ? (this.rows.sort(comp), this)
      : (mx = this.rows.slice(), mx.sort(comp), this.clone(mx))
  }

  /**
   *
   * @param {function(*,*):number} comparer - Comparer of head elements
   * @param {boolean} mutate
   * @returns {Table|*}
   */
  sortLabel (comparer, { mutate = true } = {}) {
    let { head, columns } = this;
    [head, columns] = sortKeyedVectors(head, columns, comparer)
    return this.boot(mutate, { rows: columns|> transpose, head })
  }

  /**
   *
   * @param {TableSpec} spec
   * @param {string} spec.side side
   * @param {string} spec.head head
   * @param {{field:string, crit:function(*):boolean}[]} spec.filter
   * @param {{field:string, stat:function([]):number}[]} spec.cell
   * @param {function({}):number} spec.calc - ({col1,col2,...})=>number
   * @returns {CrosTab}
   */
  crosTab (spec) { return tablePivot(this, spec) }

  boot (mutate, { rows, head, types }) { return mutate ? this.reboot(rows, head, types) : this.clone(rows, head, types)}

  /**
   * Return 'this' by loading a new rows
   * @param {*[][]} rows
   * @param {*[]} [head]
   * @param {string[]} [types]
   * @return {Table}
   */
  reboot (rows, head, types) {
    if (rows) this.rows = rows
    if (head) this.head = head
    if (types) this.types = types
    return this
  }

  /**
   *
   * @param {*[][]} [rows]
   * @param {*[]} [head]
   * @param {*[]} [types]
   * @return {Table}
   */
  clone (rows, head, types) {
    return new Table(
      head || this.head.slice(),
      rows || (this.rows |> Mx.clone),
      this.title,
      types || this.types.slice()
    )
  }
}
