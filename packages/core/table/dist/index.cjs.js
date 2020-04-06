'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tableInit = require('@analys/table-init');
var tableFilter = require('@analys/table-filter');
var tableFind = require('@analys/table-find');
var tableDivide = require('@analys/table-divide');
var tablePivot = require('@analys/table-pivot');
var tableLookup = require('@analys/table-lookup');
var keyedColumns = require('@analys/keyed-columns');
var borel = require('borel');
var comparer = require('@aryth/comparer');
var distinctColumn = require('@aryth/distinct-column');
var matrix = require('@vect/matrix');
var vectorMapper = require('@vect/vector-mapper');
var vectorUpdate = require('@vect/vector-update');
var matrixMapper = require('@vect/matrix-mapper');
var columnMapper = require('@vect/column-mapper');
var columnGetter = require('@vect/column-getter');
var columnsUpdate = require('@vect/columns-update');
var tableChips = require('@analys/table-chips');
var tableTypes = require('@analys/table-types');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Table {
  /** @type {*[]} */

  /** @type {*[][]} */

  /** @type {string} */

  /** @type {string[]} */

  /**
   * @param {*[]} [head]
   * @param {*[][]} [rows]
   * @param {string} [title]
   * @param {string[]} [types]
   */
  constructor(head, rows, title, types) {
    _defineProperty(this, "head", void 0);

    _defineProperty(this, "rows", void 0);

    _defineProperty(this, "title", void 0);

    _defineProperty(this, "types", void 0);

    this.head = head || [];
    this.rows = rows || [[]];
    this.title = title || '';
    this.types = types;
  }

  static from(o) {
    return new Table(o.head || o.banner, o.rows || o.matrix, o.title, o.types);
  }
  /**
   *
   * @param {*|[*,*]} [headFields]
   * @returns {Object[]}
   */


  toSamples(headFields) {
    return headFields ? keyedColumns.selectSamplesByHead.call(this, headFields) : keyedColumns.keyedColumnsToSamples.call(this);
  }
  /**
   *
   * @param {boolean} [mutate=false]
   * @returns {*}
   */


  toJson(mutate = false) {
    var _this, _this2;

    return mutate ? (_this = this, tableInit.slice(_this)) : (_this2 = this, tableInit.shallow(_this2));
  }

  get size() {
    return matrix.size(this.rows);
  }

  get ht() {
    var _this$rows;

    return (_this$rows = this.rows) === null || _this$rows === void 0 ? void 0 : _this$rows.length;
  }

  get wd() {
    var _this$head;

    return (_this$head = this.head) === null || _this$head === void 0 ? void 0 : _this$head.length;
  }

  get columns() {
    return matrix.transpose(this.rows);
  }

  cell(x, field) {
    const row = this.rows[x];
    return row ? row[this.coin(field)] : undefined;
  }

  coin(field) {
    return this.head.indexOf(field);
  }

  columnIndexes(fields) {
    return fields.map(this.coin, this);
  }

  column(field) {
    return columnGetter.column(this.rows, this.coin(field), this.ht);
  }

  setColumn(field, column) {
    return columnMapper.mutate(this.rows, this.coin(field), (_, i) => column[i], this.ht), this;
  }

  mutateColumn(field, fn) {
    return columnMapper.mutate(this.rows, this.coin(field), (x, i) => fn(x, i), this.ht), this;
  }

  pushRow(row) {
    return this.rows.push(row), this;
  }

  unshiftRow(row) {
    return this.rows.unshift(row), this;
  }

  pushColumn(label, column) {
    return this.head.push(label), columnsUpdate.push(this.rows, column), this;
  }

  unshiftColumn(label, column) {
    return this.head.unshift(label), columnsUpdate.unshift(this.rows, column), this;
  }

  popRow() {
    return this.rows.pop();
  }

  shiftRow() {
    return this.rows.shift();
  }

  popColumn() {
    return columnsUpdate.pop(this.rows);
  }

  shiftColumn() {
    return columnsUpdate.shift(this.rows);
  }

  map(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      rows: matrixMapper.mapper(this.rows, fn, this.ht, this.wd)
    }, mutate);
  }

  mapHead(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      head: vectorMapper.mapper(this.head, fn)
    }, mutate);
  }

  lookupOne(valueToFind, key, field, cached = true) {
    return (cached ? tableLookup.lookupCached : tableLookup.lookup).call(this, valueToFind, key, field);
  }

  lookupMany(valuesToFind, key, field) {
    return tableLookup.lookupMany.call(this, valuesToFind, key, field);
  }

  lookupTable(key, field, objectify) {
    return tableLookup.lookupTable.call(this, key, field, objectify);
  }
  /**
   *
   * @param {*[]|[*,*][]} fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */


  select(fields, {
    mutate = false
  } = {}) {
    var _this3;

    let o = mutate ? this : (_this3 = this, tableInit.slice(_this3));
    keyedColumns.selectKeyedColumns.call(o, fields);
    return mutate ? this : this.copy(o);
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


  insertColumn(label, column, {
    field,
    mutate = false
  } = {}) {
    var _this4;

    const o = mutate ? this : (_this4 = this, tableInit.shallow(_this4)),
          index = this.coin(field) + 1;
    o.head.splice(index, 0, label);
    vectorMapper.iterate(o.rows, (row, i) => row.splice(index, 0, column[i]));
    return mutate ? this : Table.from(o);
  }
  /**
   *
   * @param {*} field
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */


  deleteColumn(field, {
    mutate = false
  } = {}) {
    var _this5;

    const o = mutate ? this : (_this5 = this, tableInit.shallow(_this5)),
          index = this.coin(field);
    o.head.splice(index, 1);
    o.rows.forEach(row => row.splice(index, 1));
    return mutate ? this : Table.from(o);
  }
  /**
   *
   * @param {*[]|[*,*][]} fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */


  spliceColumns(fields, {
    mutate = false
  } = {}) {
    var _this6;

    const o = mutate ? this : (_this6 = this, tableInit.shallow(_this6)),
          indexes = this.columnIndexes(fields).sort(comparer.NUM_ASC);
    columnsUpdate.splices(o.rows, indexes), vectorUpdate.splices(o.head, indexes);
    return mutate ? this : Table.from(o);
  }

  divide(fields, {
    mutate = false
  } = {}) {
    var _this7;

    const o = mutate ? this : (_this7 = this, tableInit.shallow(_this7));
    const {
      pick,
      rest
    } = tableDivide.tableDivide.call(o, fields);
    return {
      pick: Table.from(pick),
      rest: mutate ? this : Table.from(rest)
    };
  }
  /**
   *
   * @param {Object|Filter[]|Filter} filterCollection
   * @param {boolean} [mutate=true]
   * @return {Table}
   */


  filter(filterCollection, {
    mutate = true
  } = {}) {
    var _this8;

    const o = mutate ? this : (_this8 = this, tableInit.slice(_this8));
    tableFilter.tableFilter.call(o, filterCollection);
    return mutate ? this : this.copy(o);
  }
  /**
   *
   * @param {Object<*,function(*?):boolean>} filter
   * @param {boolean} [mutate=true]
   * @return {Table}
   */


  find(filter, {
    mutate = true
  } = {}) {
    var _this9;

    const o = mutate ? this : (_this9 = this, tableInit.slice(_this9));
    tableFind.tableFind.call(o, filter);
    return mutate ? this : this.copy(o);
  }

  distinct(fields, {
    mutate = true
  } = {}) {
    var _this10;

    const o = mutate ? this : (_this10 = this, tableInit.slice(_this10));

    for (let field of fields) o.rows = borel.StatMx.distinct(o.rows, this.coin(field));

    return mutate ? this : this.copy(o);
  }
  /**
   *
   * @param {*} field
   * @param {boolean} [count=false]
   * @param {string|boolean} [sort=false] - When sort is function, sort must be a comparer between two point element.
   * @returns {[any, any][]|[]|any[]|*}
   */


  distinctOnColumn(field, {
    count = false,
    sort = false
  } = {}) {
    return count ? distinctColumn.DistinctCount(this.coin(field))(this.rows, {
      l: this.ht,
      sort
    }) : distinctColumn.Distinct(this.coin(field))(this.rows, this.ht);
  }
  /**
   *
   * @param field
   * @param comparer
   * @param mutate
   * @returns {Table} - 'this' Table rows is mutated by sort function
   */


  sort(field, comparer, {
    mutate = true
  } = {}) {
    var _this11;

    const y = this.coin(field);

    const rowComparer = (a, b) => comparer(a[y], b[y]);

    const o = mutate ? this : (_this11 = this, tableInit.slice(_this11));
    o.rows.sort(rowComparer);
    return mutate ? this : this.copy(o);
  }
  /**
   *
   * @param {function(*,*):number} comparer - Comparer of head elements
   * @param {boolean} mutate
   * @returns {Table|*}
   */


  sortLabel(comparer, {
    mutate = true
  } = {}) {
    var _this12;

    let o = mutate ? this : (_this12 = this, tableInit.slice(_this12));
    sortColumnsByKeys.call(o, comparer);
    return mutate ? this : this.copy(o);
  }
  /**
   * @param {Object} options
   * @param {*} options.key
   * @param {*} [options.field]
   * @param {number} [options.mode=ACCUM] - MERGE, ACCUM, INCRE, COUNT
   * @param {boolean} [options.objectify=true]
   * @return {[*,*][]|{}}
   */


  chips(options = {}) {
    return tableChips.tableChips.call(this, options);
  }
  /**
   * @param {Object} options
   * @param {*} options.side
   * @param {*} options.banner
   * @param {*} [options.field]
   * @param {Object<*,function(*?):boolean>} [options.filter]
   * @param {function(...*):number} [options.formula] - formula is valid only when cell is CubeCell array.
   * @returns {CrosTab}
   */


  crosTab(options = {}) {
    return tablePivot.pivotEdge(this, options);
  }
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


  crosTabDev({
    side,
    banner,
    cell,
    filter,
    formula
  }) {
    return tablePivot.pivotDev(this, {
      side,
      banner,
      cell,
      filter,
      formula
    });
  }

  inferTypes({
    inferType,
    omitNull = true,
    mutate = false
  } = {}) {
    const types = tableTypes.inferTypes.call(this, {
      inferType,
      omitNull
    });
    if (mutate) this.types = types;
    return types;
  }
  /** @returns {Table} */


  boot({
    types,
    head,
    rows
  } = {}, mutate) {
    if (mutate) {
      if (head) this.head = head;
      if (rows) this.rows = rows;
      if (types) this.types = types;
      return this;
    } else {
      return this.copy({
        types,
        head,
        rows
      });
    }
  }
  /** @returns {Table} */


  copy({
    types,
    head,
    rows
  } = {}) {
    var _this$types;

    if (!head) head = this.head.slice();
    if (!rows) rows = this.rows.map(row => row.slice());
    if (!types) types = (_this$types = this.types) === null || _this$types === void 0 ? void 0 : _this$types.slice();
    return new Table(head, rows, this.title, types);
  }

  from(AeroEngineSpecs) {
    return undefined;
  }

}

exports.Table = Table;
