import {
  keyedColumnsToSamples,
  selectKeyedColumns,
  selectSamplesByHead,
  sortColumnsByKeys
}                                                                               from '@analys/keyed-columns'
import { tableChips }                                                           from '@analys/table-chips'
import { tableDivide }                                                          from '@analys/table-divide'
import { tableFilter }                                                          from '@analys/table-filter'
import { tableFind }                                                            from '@analys/table-find'
import { tableFormula }                                                         from '@analys/table-formula'
import { tableGroup }                                                           from '@analys/table-group'
import { shallow, slice }                                                       from '@analys/table-init'
import { tableJoin }                                                            from '@analys/table-join'
import { lookup, lookupCached, lookupMany, lookupTable }                        from '@analys/table-lookup'
import { tableAcquire, tableMerge }                                             from '@analys/table-merge'
import { tablePivot }                                                           from '@analys/table-pivot'
import { inferTypes }                                                           from '@analys/table-types'
import { NUM_ASC }                                                              from '@aryth/comparer'
import { Distinct as DistinctOnColumn, DistinctCount as DistinctCountOnColumn } from '@aryth/distinct-column'
import { column }                                                               from '@vect/column-getter'
import { mutate as mutateColumn }                                               from '@vect/column-mapper'
import {
  pop as popColumn,
  push as pushColumn,
  shift as shiftColumn,
  splices as splicesColumns,
  unshift as unshiftColumn
}                                                                               from '@vect/columns-update'
import { size, transpose }                                                      from '@vect/matrix'
import { mapper as mapperMatrix, mutate as mutateMatrix, selectMutate }         from '@vect/matrix-mapper'
import { wind }                                                                 from '@vect/object-init'
import { difference, intersect }                                                from '@vect/vector-algebra'
import { iterate, mapper, mutate as mutateVector }                              from '@vect/vector-mapper'
import { splices }                                                              from '@vect/vector-update'
import { StatMx }                                                               from 'borel'

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
  constructor(head, rows, title, types) {
    this.head = head || []
    this.rows = rows || [[]]
    this.title = title || ''
    this.types = types
  }

  static from(o) { return new Table(o.head || o.banner, o.rows || o.matrix, o.title, o.types) }
  toSamples(fields) { return fields ? selectSamplesByHead.call(this, fields) : keyedColumnsToSamples.call(this) }
  toObject(mutate = false) { return mutate ? this |> slice : this |> shallow }

  setTitle(title) { return this.title = title, this }
  get size() { return size(this.rows) }
  get ht() { return this.rows?.length }
  get wd() { return this.head?.length }
  get height() { return this.rows?.length }
  get width() { return this.head?.length }
  get columns() { return transpose(this.rows) }
  cell(x, field) { return (x in this.rows) ? this.rows[x][this.coin(field)] : undefined }
  coin(field) { return this.head.indexOf(field) }
  columnIndexes(fields) { return fields.map(this.coin, this) }
  row(field, value, objectify) {
    const vector = this.rows.find(row => row[this.coin(field)] === value)
    return vector && objectify ? wind(this.head, vector) : vector
  }
  column(field) { return column(this.rows, this.coin(field), this.height) }
  setColumn(field, column) { return mutateColumn(this.rows, this.coin(field), (_, i) => column[i], this.height), this }
  mutateColumn(field, fn) { return mutateColumn(this.rows, this.coin(field), (x, i) => fn(x, i), this.height), this }

  pushRow(row) { return this.rows.push(row), this }
  unshiftRow(row) { return this.rows.unshift(row), this }
  pushColumn(label, column) { return this.head.push(label), pushColumn(this.rows, column), this }
  unshiftColumn(label, column) { return this.head.unshift(label), unshiftColumn(this.rows, column), this }
  popRow() { return this.rows.pop() }
  shiftRow() { return this.rows.shift() }
  popColumn() { return popColumn(this.rows) }
  shiftColumn() { return shiftColumn(this.rows) }
  renameColumn(field, newName) {
    const ci = this.coin(field)
    if (ci >= 0) this.head[ci] = newName
    return this
  }

  mapHead(fn, { mutate = true } = {}) { return this.boot({ head: mapper(this.head, fn) }, mutate) }
  mutateHead(fn) { return mutateVector(this.head, fn), this }
  map(fn, { mutate = true } = {}) { return this.boot({ rows: mapperMatrix(this.rows, fn, this.height, this.width) }, mutate) }
  mutate(fn, { fields, exclusive } = {}) {
    if (!fields && !exclusive) return mutateMatrix(this.rows, fn, this.height, this.width), this
    fields = fields ?? this.head
    fields = exclusive ? difference(fields, exclusive) : fields
    return selectMutate(this.rows, this.columnIndexes(fields), fn, this.height), this
  }

  lookupOne(valueToFind, key, field, cached = true) { return (cached ? lookupCached : lookup).call(this, valueToFind, key, field) }
  lookupMany(valuesToFind, key, field) { return lookupMany.call(this, valuesToFind, key, field) }
  lookupTable(key, field, objectify) { return lookupTable.call(this, key, field, objectify) }

  /**
   *
   * @param {*[]|[*,*][]} fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */
  select(fields, { mutate = false } = {}) {
    let o = mutate ? this : slice(this)
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
  insertColumn(label, column, { field, mutate = false } = {}) {
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
  deleteColumn(field, { mutate = false } = {}) {
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
  spliceColumns(fields, { mutate = false } = {}) {
    const o = mutate ? this : this |> shallow, indexes = this.columnIndexes(fields).sort(NUM_ASC)
    splicesColumns(o.rows, indexes), splices(o.head, indexes)
    return mutate ? this : this.copy(o)
  }

  divide(fields, { mutate = false } = {}) {
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
  filter(filterCollection, { mutate = true } = {}) {
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
  find(filter, { mutate = true } = {}) {
    const o = mutate ? this : this |> slice
    tableFind.call(o, filter)
    return mutate ? this : this.copy(o)
  }

  distinct(fields, { mutate = true } = {}) {
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
  distinctOnColumn(field, { count = false, sort = false } = {}) {
    return count
      ? DistinctCountOnColumn(this.coin(field))(this.rows, { l: this.height, sort })
      : DistinctOnColumn(this.coin(field))(this.rows, this.height)
  }

  /**
   *
   * @param field
   * @param comparer
   * @param mutate
   * @returns {Table} - 'this' Table rows is mutated by sort function
   */
  sort(field, comparer, { mutate = true } = {}) {
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
  sortLabel(comparer, { mutate = true } = {}) {
    let o = mutate ? this : this |> slice
    sortColumnsByKeys.call(o, comparer)
    return mutate ? this : this.copy(o)
  }

  join(another, fields, joinType, fillEmpty) { return Table.from(tableJoin(this, another, fields, joinType, fillEmpty)) }

  /**
   *
   * @param {Table} another
   * @param {boolean} [mutate=true]
   * @return {Table}
   */
  union(another, { mutate = true } = {}) {
    const self = mutate ? this : this.copy()
    const shared = intersect(self.head, another.head)
    if (shared.length) {
      for (let label of shared) self.setColumn(label, another.column(label))
      another = another.spliceColumns(shared, { mutate })
    }
    return mutate
      ? tableAcquire(self, another)
      : this.copy(tableMerge(self, another))
  }

  /**
   * @param {Object} options
   * @param {*} options.key
   * @param {*} [options.field]
   * @param {number} [options.mode=ACCUM] - MERGE, ACCUM, INCRE, COUNT
   * @param {boolean} [options.objectify=true]
   * @return {[*,*][]|{}}
   */
  chips(options = {}) { return tableChips.call(this, options)}

  /**
   * @param {Object} options
   * @param {*} options.key
   * @param {*} [options.field]
   * @param {Function} [options.filter]
   * @param {Object|Array} [options.alias]
   * @return {Table}
   */
  group(options = {}) { return Table.from(tableGroup.call(this, options)) }

  /**
   * @param {Object} options
   * @param {Object|Array} [formulae]
   * @param {Function} [options.filter]
   * @param {boolean} [options.append=true]
   * @return {Table}
   */
  formula(formulae, options = {}) { return Table.from(tableFormula.call(this, formulae, options)) }

  /**
   * @param {Object} options
   * @param {str|str[]|Object<str,Function>|[string,Function][]} options.side
   * @param {str|str[]|Object<str,Function>|[string,Function][]} options.banner
   * @param {Object|*[]|string|number} [options.field]
   * @param {Object<string|number,function(*?):boolean>} [options.filter]
   * @param {function(...*):number} [options.formula] - formula is valid only when cell is CubeCell array.
   * @returns {CrosTab}
   */
  crosTab(options = {}) {
    const table = slice(this)
    if (options.filter) { tableFind.call(table, options.filter) }
    return tablePivot.call(options, this)
  }

  inferTypes({ inferType, omitNull = true, mutate = false } = {}) {
    const types = inferTypes.call(this, { inferType, omitNull })
    return mutate ? (this.types = types) : types
  }

  /** @returns {Table} */
  boot({ head, rows, types } = {}, mutate = true) {
    if (mutate) {
      if (head) this.head = head
      if (rows) this.rows = rows
      if (types) this.types = types
      return this
    } else {
      return this.copy({ head, rows, types })
    }
  }

  /** @returns {Table} */
  copy({ head, rows, types } = {}) {
    if (!head) head = this.head.slice()
    if (!rows) rows = this.rows.map(row => row.slice())
    if (!types) types = this.types?.slice()
    return new Table(head, rows, this.title, types)
  }
}


/**
 * @param {str|str[]|Object<str,Function>|[string,Function][]} side
 * @param {str|str[]|Object<str,Function>|[string,Function][]} banner
 * @param {Object|*[]|string|number} [field]
 * @param {Object<string|number,function(*?):boolean>} [filter]
 * @param {function(...*):number} [formula] - formula is valid only when cell is CubeCell array.
 */