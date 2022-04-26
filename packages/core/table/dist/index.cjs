'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tableChips = require('@analys/table-chips');
var tableDivide = require('@analys/table-divide');
var tableFilter = require('@analys/table-filter');
var tableFind = require('@analys/table-find');
var tableFormula = require('@analys/table-formula');
var tableGroup = require('@analys/table-group');
var tableInit = require('@analys/table-init');
var tableJoin = require('@analys/table-join');
var tableLookup = require('@analys/table-lookup');
var tableMerge = require('@analys/table-merge');
var tablePivot = require('@analys/table-pivot');
var tableSelect = require('@analys/table-select');
var tableTypes = require('@analys/table-types');
var tabular = require('@analys/tabular');
var comparer = require('@aryth/comparer');
var distinctColumn = require('@aryth/distinct-column');
var distinctMatrix = require('@aryth/distinct-matrix');
var columnGetter = require('@vect/column-getter');
var columnMapper = require('@vect/column-mapper');
var columnsUpdate = require('@vect/columns-update');
var matrix = require('@vect/matrix');
var matrixMapper = require('@vect/matrix-mapper');
var objectInit = require('@vect/object-init');
var vectorAlgebra = require('@vect/vector-algebra');
var vectorMapper = require('@vect/vector-mapper');
var vectorUpdate = require('@vect/vector-update');

class Table {
  /** @type {*[]} */
  head;
  /** @type {*[][]} */

  rows;
  /** @type {string} */

  title;
  /** @type {string[]} */

  types;
  /**
   * @param {*[]} [head]
   * @param {*[][]} [rows]
   * @param {string} [title]
   * @param {string[]} [types]
   */

  constructor(head, rows, title, types) {
    this.head = head || [];
    this.rows = rows || [];
    this.title = title || '';
    this.types = types;
  }

  static from(o) {
    return new Table(o.head || o.banner, o.rows || o.matrix, o.title, o.types);
  }

  toSamples(fields) {
    return fields ? tabular.selectTabularToSamples.call(this, fields) : tabular.tabularToSamples.call(this);
  }

  toObject(mutate = false) {
    var _this, _this2;

    return mutate ? (_this = this, tableInit.slice(_this)) : (_this2 = this, tableInit.shallow(_this2));
  }

  setTitle(title) {
    return this.title = title, this;
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

  get height() {
    var _this$rows2;

    return (_this$rows2 = this.rows) === null || _this$rows2 === void 0 ? void 0 : _this$rows2.length;
  }

  get width() {
    var _this$head2;

    return (_this$head2 = this.head) === null || _this$head2 === void 0 ? void 0 : _this$head2.length;
  }

  get columns() {
    return matrix.transpose(this.rows);
  }

  cell(x, field) {
    return x in this.rows ? this.rows[x][this.coin(field)] : undefined;
  }

  coin(field) {
    return this.head.indexOf(field);
  }

  columnIndexes(fields) {
    return fields.map(this.coin, this);
  }

  row(field, value, objectify) {
    const vector = this.rows.find(row => row[this.coin(field)] === value);
    return vector && objectify ? objectInit.wind(this.head, vector) : vector;
  }

  column(field) {
    return columnGetter.column(this.rows, this.coin(field), this.height);
  }

  setColumn(field, column) {
    return columnMapper.mutate(this.rows, this.coin(field), (_, i) => column[i], this.height), this;
  }

  mutateColumn(field, fn) {
    return columnMapper.mutate(this.rows, this.coin(field), (x, i) => fn(x, i), this.height), this;
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
    return [this.head.pop(), columnsUpdate.pop(this.rows)];
  }

  shiftColumn() {
    return [this.head.shift(), columnsUpdate.shift(this.rows)];
  }

  renameColumn(field, newName) {
    const ci = this.coin(field);
    if (ci >= 0) this.head[ci] = newName;
    return this;
  }

  mapHead(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      head: vectorMapper.mapper(this.head, fn)
    }, mutate);
  }

  mutateHead(fn) {
    return vectorMapper.mutate(this.head, fn), this;
  }

  map(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      rows: matrixMapper.mapper(this.rows, fn, this.height, this.width)
    }, mutate);
  }

  mutate(fn, {
    fields,
    exclusive
  } = {}) {
    if (!fields && !exclusive) return matrixMapper.mutate(this.rows, fn, this.height, this.width), this;
    fields = fields ?? this.head;
    fields = exclusive ? vectorAlgebra.difference(fields, exclusive) : fields;
    return matrixMapper.selectMutate(this.rows, this.columnIndexes(fields), fn, this.height), this;
  }

  lookupOne(valueToFind, key, field, cached = true) {
    return (cached ? tableLookup.lookupCached : tableLookup.lookup).call(this, valueToFind, key, field);
  }

  lookupMany(valuesToFind, key, field) {
    return tableLookup.lookupMany.call(this, valuesToFind, key, field);
  }
  /**
   *
   * @param {string} key
   * @param {string|string[]|[string,string][]} [field]
   * @param {boolean} [objectify=true]
   * @return {Object|Array}
   */


  lookupTable(key, field, objectify = true) {
    return tableSelect.tableToObject.call(this, key, field, objectify);
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
    let o = mutate ? this : tableInit.slice(this);
    tabular.selectTabular.call(o, fields);
    return mutate ? this : this.copy(o);
  }
  /**
   *
   * @param {*} field
   * @param {Function} splitter
   * @param {*} [fields] - new names of divided fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */


  divideColumn(field, splitter, {
    fields,
    mutate = false
  } = {}) {
    var _this3;

    const o = mutate ? this : (_this3 = this, tableInit.shallow(_this3)),
          y = this.coin(field);
    o.head.splice(y, 1, ...(fields ?? splitter(field)));
    vectorMapper.iterate(o.rows, row => row.splice(y, 1, ...splitter(row[y])));
    return mutate ? this : Table.from(o);
  }
  /**
   *
   * @param {{key,to,as}|{key,to,as}[]} fieldSpec
   * @param {*} [nextTo] - the existing field after which the newField inserts
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */


  proliferateColumn(fieldSpec, {
    nextTo,
    mutate = false
  } = {}) {
    var _this4, _fieldSpec;

    if (!Array.isArray(fieldSpec)) fieldSpec = [fieldSpec];
    const o = mutate ? this : (_this4 = this, tableInit.shallow(_this4)),
          {
      head,
      rows
    } = o,
          y = nextTo ? this.coin(nextTo) + 1 : 0;
    fieldSpec.forEach(o => o.index = this.coin(o.key));

    if (((_fieldSpec = fieldSpec) === null || _fieldSpec === void 0 ? void 0 : _fieldSpec.length) === 1) {
      const [{
        index,
        to,
        as
      }] = fieldSpec;
      head.splice(y, 0, as);
      vectorMapper.iterate(rows, row => row.splice(y, 0, to(row[index])));
    } else {
      head.splice(y, 0, ...fieldSpec.map(({
        as
      }) => as));
      vectorMapper.iterate(rows, row => row.splice(y, 0, ...fieldSpec.map(({
        index,
        to
      }) => to(row[index]))));
    }

    return mutate ? this : Table.from(o);
  }
  /**
   *
   * @param {*|*[]} newField
   * @param {*[]|*[][]} column
   * @param {*} [nextTo] - the existing field after which the newField inserts
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */


  insertColumn(newField, column, {
    nextTo,
    mutate = false
  } = {}) {
    var _this5;

    const o = mutate ? this : (_this5 = this, tableInit.shallow(_this5)),
          y = nextTo ? this.coin(nextTo) + 1 : 0;

    if (Array.isArray(newField)) {
      o.head.splice(y, 0, ...newField);
      vectorMapper.iterate(o.rows, (row, i) => row.splice(y, 0, ...column[i]));
    } else {
      o.head.splice(y, 0, newField);
      vectorMapper.iterate(o.rows, (row, i) => row.splice(y, 0, column[i]));
    }

    return mutate ? this : Table.from(o);
  }
  /**
   *
   * @param {*|*[]} field
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */


  deleteColumn(field, {
    mutate = false
  } = {}) {
    var _this6;

    const o = mutate ? this : (_this6 = this, tableInit.shallow(_this6));
    const {
      head,
      rows
    } = o;

    if (Array.isArray(field)) {
      const indexes = this.columnIndexes(field).filter(i => i >= 0).sort(comparer.NUM_ASC);
      vectorUpdate.splices(head, indexes);
      columnsUpdate.splices(rows, indexes);
    } else {
      const index = this.coin(field);
      head.splice(index, 1);
      rows.forEach(row => row.splice(index, 1));
    }

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
  } //TODO: supposedly returns rows, currently only returns specific column


  distinct(fields, {
    mutate = true
  } = {}) {
    var _this10;

    const o = mutate ? this : (_this10 = this, tableInit.slice(_this10));

    for (let field of fields) o.rows = distinctMatrix.distinctByColumn.call(o.rows, this.coin(field));

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
      l: this.height,
      sort
    }) : distinctColumn.Distinct(this.coin(field))(this.rows, this.height);
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
    tabular.sortTabularByKeys.call(o, comparer);
    return mutate ? this : this.copy(o);
  }

  join(another, fields, joinType, fillEmpty) {
    return Table.from(tableJoin.tableJoin(this, another, fields, joinType, fillEmpty));
  }
  /**
   *
   * @param {Table} another
   * @param {boolean} [mutate=true]
   * @return {Table}
   */


  union(another, {
    mutate = true
  } = {}) {
    const self = mutate ? this : this.copy();
    const shared = vectorAlgebra.intersect(self.head, another.head);

    if (shared.length) {
      for (let label of shared) self.setColumn(label, another.column(label));

      another = another.deleteColumn(shared, {
        mutate
      });
    }

    return mutate ? tableMerge.tableAcquire(self, another) : this.copy(tableMerge.tableMerge(self, another));
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
   * @param {*} options.key
   * @param {*} [options.field]
   * @param {Function} [options.filter]
   * @param {Object|Array} [options.alias]
   * @return {Table}
   */


  group(options = {}) {
    return Table.from(tableGroup.tableGroup.call(this, options));
  }
  /**
   * @param {Object} options
   * @param {Object|Array} [formulae]
   * @param {Function} [options.filter]
   * @param {boolean} [options.append=true]
   * @return {Table}
   */


  formula(formulae, options = {}) {
    return Table.from(tableFormula.tableFormula.call(this, formulae, options));
  }
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
    const table = tableInit.slice(this);

    if (options.filter) {
      tableFind.tableFind.call(table, options.filter);
    }

    return tablePivot.tablePivot.call(options, table);
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
    return mutate ? this.types = types : types;
  }
  /** @returns {Table} */


  boot({
    head,
    rows,
    types
  } = {}, mutate = true) {
    if (mutate) {
      if (head) this.head = head;
      if (rows) this.rows = rows;
      if (types) this.types = types;
      return this;
    } else {
      return this.copy({
        head,
        rows,
        types
      });
    }
  }
  /** @returns {Table} */


  copy({
    head,
    rows,
    types
  } = {}) {
    var _this$types;

    if (!head) head = this.head.slice();
    if (!rows) rows = this.rows.map(row => row.slice());
    if (!types) types = (_this$types = this.types) === null || _this$types === void 0 ? void 0 : _this$types.slice();
    return new Table(head, rows, this.title, types);
  }

}
/**
 * @param {str|str[]|Object<str,Function>|[string,Function][]} side
 * @param {str|str[]|Object<str,Function>|[string,Function][]} banner
 * @param {Object|*[]|string|number} [field]
 * @param {Object<string|number,function(*?):boolean>} [filter]
 * @param {function(...*):number} [formula] - formula is valid only when cell is CubeCell array.
 */

exports.Table = Table;
