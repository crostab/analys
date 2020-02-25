'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var veho = require('veho');
var borel = require('borel');
var utilPivot = require('@analys/util-pivot');
var tablePivot = require('@analys/table-pivot');
var distinctColumn = require('@aryth/distinct-column');
var comparer = require('@aryth/comparer');
var vectorMapper = require('@vect/vector-mapper');
var vectorUpdate = require('@vect/vector-update');
var entriesUnwind = require('@vect/entries-unwind');
var matrix = require('@vect/matrix');
var matrixMapper = require('@vect/matrix-mapper');
var columnMapper = require('@vect/column-mapper');
var columnsSelect = require('@vect/columns-select');
var columnsMapper = require('@vect/columns-mapper');
var columnsUpdate = require('@vect/columns-update');
var objectInit = require('@vect/object-init');
var numStrict = require('@typen/num-strict');

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

const parserSelector = typeName => {
  switch (typeName) {
    case 'string':
      return String;

    case 'number':
    case 'float':
      return Number.parseFloat;

    case 'integer':
      return Number.parseInt;

    case 'boolean':
      return Boolean;

    default:
      return void 0;
  }
};

/**
 *
 * @param {*[]} column
 * @return {string|unknown}
 */

function inferArrayType(column) {
  if (!column.length) return 'null';
  const types = column.map(numStrict.inferType);
  const distinct = new Set(types);

  switch (new Set(types).size) {
    case 1:
      return types[0];

    case 2:
      return distinct.has('number') && distinct.has('numstr') ? 'numstr' : 'misc';

    default:
      return 'misc';
  }
}

/**
 *
 */

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
  /**
   *
   * @param {*[]} [head]
   * @param {*[][]} [rows]
   * @param {string} [title]
   * @param {string[]} [types]
   * @return {Table}
   */


  static build({
    head,
    rows,
    title,
    types
  }) {
    return new Table(head, rows, title, types);
  }
  /**
   *
   * @param {str|[*,*]} [field]
   * @returns {[str,number]}
   */


  lookUpFieldIndex(field) {
    if (!Array.isArray(field)) return [field, this.coin(field)];
    let [currField, newField] = field;
    return [newField, this.coin(currField)];
  }
  /**
   *
   * @param {(str|[*,*])[]} fields
   * @returns {[str,number][]}
   */


  lookUpFieldIndexes(fields) {
    return vectorMapper.mapper(fields, field => this.lookUpFieldIndex(field));
  }
  /**
   *
   * @param {str|[*,*]} [fields]
   * @returns {Object<*, *>[]}
   */


  toSamples(fields) {
    if (!(fields === null || fields === void 0 ? void 0 : fields.length)) return this.rows.map(row => objectInit.wind(this.head, row));
    const fieldToIndexEntries = fields.map(this.lookUpFieldIndex.bind(this));
    return this.rows.map(row => objectInit.initByValues(fieldToIndexEntries, i => row[i]));
  }
  /**
   *
   * @param {boolean} [mutate=true]
   * @returns {*}
   */


  toJson(mutate = true) {
    var _rows;

    const {
      head,
      rows,
      title
    } = this;
    return mutate ? {
      head,
      rows,
      title
    } : {
      head: head.slice(),
      rows: (_rows = rows, veho.Mx.clone(_rows)),
      title: title === null || title === void 0 ? void 0 : title.slice()
    };
  }
  /**
   *
   * @param {{}[]} samples
   * @param {*[]|[*,*][]} [fields]
   * @param {string} [title]
   * @param {*[]} [types]
   * @return {Table}
   */


  static fromSamples(samples, {
    fields,
    title,
    types
  } = {}) {
    const {
      head,
      rows
    } = veho.Samples.toTable(samples, {
      fields
    });
    return new Table(head, rows, title, types);
  }
  /**
   *
   * @param {*[]|[*,*][]} fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */


  select(fields, {
    mutate = true
  } = {}) {
    if (!(fields === null || fields === void 0 ? void 0 : fields.length)) return mutate ? this : this.clone();
    const fieldToIndexes = this.lookUpFieldIndexes(fields);
    const {
      indexes,
      head
    } = entriesUnwind.unwind(fieldToIndexes);
    const rows = columnsSelect.select(this.rows, indexes);
    return this.boot(mutate, {
      rows,
      head
    });
  }
  /**
   *
   * @param {*[]|[*,*][]} fields
   * @param {boolean=true} [mutate]
   * @returns {Table}
   */


  spliceColumns(fields, {
    mutate = true
  } = {}) {
    const ys = fields.map(this.coin.bind(this)).sort(comparer.NUM_ASC),
          {
      rows,
      head
    } = this;
    return mutate ? this.reboot(columnsUpdate.splices(rows, ys), vectorUpdate.splices(head, ys)) : this.clone(columnsUpdate.splices(veho.Mx.copy(rows), ys), vectorUpdate.splices(head.slice(), ys));
  }

  map(fn, {
    mutate = true
  } = {}) {
    return this.boot(mutate, {
      rows: matrixMapper.mapper(this.rows, fn, this.ht, this.wd)
    });
  }

  mapBanner(fn, {
    mutate = true
  } = {}) {
    return this.boot(mutate, {
      head: vectorMapper.mapper(this.head, fn)
    });
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
    return this.rows[x][this.coin(y)];
  }

  coin(field) {
    return this.head.indexOf(field);
  }

  columnIndexes(fields) {
    return fields.map(field => this.coin(field));
  }

  column(field) {
    return this.rows.map(row => row[field = this.coin(field)]);
  }

  setColumn(field, column) {
    return columnMapper.mutate(this.rows, this.coin(field), (_, i) => column[i], this.ht), this;
  }

  setColumnBy(field, fn) {
    return columnMapper.mutate(this.rows, this.coin(field), (x, i) => fn(x, i), this.ht), this;
  }

  pushRow(row) {
    return this.rows.push(row), this;
  }

  unshiftRow(row) {
    return this.rows.unshift(row), this;
  }

  pushColumn(label, col) {
    return this.head.push(label), columnsUpdate.push(this.rows, col), this;
  }

  unshiftColumn(label, col) {
    return this.head.unshift(label), columnsUpdate.unshift(this.rows, col), this;
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
  /**
   *
   * Specify the type of a column. No return
   * @param {str} field accept both column name in string or column index in integer
   * @param {string} typeName string | (number, float) | integer | boolean
   */


  changeType(field, typeName) {
    const y = this.coin(field),
          parser = parserSelector(typeName);
    if (parser) columnMapper.mutate(this.rows, y, parser, this.ht), this.types[y] = typeName;
    return this;
  }
  /**
   * Re-generate this._types based on DPTyp.inferArr method.
   * Cautious: This method will change all elements of this._types.
   * @return {string[]}
   */


  mutInferTypes() {
    this.types = columnsMapper.mapper(this.rows, inferArrayType);

    for (let [i, typeName] of this.types.entries()) {
      if (typeName === 'numstr') {
        this.changeType(i, 'number');
      } else if (typeName === 'misc') {
        this.changeType(i, 'string');
      }
    }

    return this.types;
  }
  /**
   *
   * @param {Filter[]|Filter} filterCollection
   * @param {boolean} [mutate=true]
   * @return {Table}
   */


  filter(filterCollection, {
    mutate = true
  } = {}) {
    let {
      rows
    } = this,
        j;

    if (Array.isArray(filterCollection)) {
      for (let {
        field,
        filter
      } of filterCollection) if ((j = this.coin(field)) >= 0) rows = rows.filter(row => filter(row[j]));
    } else {
      let {
        field,
        filter
      } = filter;
      if ((j = this.coin(field)) >= 0) rows = rows.filter(row => filter(row[j]));
    }

    return this.boot(mutate, {
      rows
    });
  }

  distinct(fields, {
    mutate = true
  } = {}) {
    let {
      rows
    } = this;

    for (let field of fields) rows = borel.StatMx.distinct(rows, this.coin(field));

    return this.boot(mutate, {
      rows
    });
  }
  /**
   *
   * @param {str} field
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

  sort(field, comparer, {
    mutate = true
  } = {}) {
    let y = this.coin(field),
        comp = (a, b) => comparer(a[y], b[y]),
        mx;

    return mutate ? (this.rows.sort(comp), this) : (mx = this.rows.slice(), mx.sort(comp), this.clone(mx));
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
    var _columns;

    let {
      head,
      columns
    } = this;
    [head, columns] = utilPivot.sortKeyedVectors(head, columns, comparer);
    return this.boot(mutate, {
      rows: (_columns = columns, matrix.transpose(_columns)),
      head
    });
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


  crosTab(spec) {
    return tablePivot.tablePivot(this, spec);
  }

  boot(mutate, {
    rows,
    head,
    types
  }) {
    return mutate ? this.reboot(rows, head, types) : this.clone(rows, head, types);
  }
  /**
   * Return 'this' by loading a new rows
   * @param {*[][]} rows
   * @param {*[]} [head]
   * @param {string[]} [types]
   * @return {Table}
   */


  reboot(rows, head, types) {
    if (rows) this.rows = rows;
    if (head) this.head = head;
    if (types) this.types = types;
    return this;
  }
  /**
   *
   * @param {*[][]} [rows]
   * @param {*[]} [head]
   * @param {*[]} [types]
   * @return {Table}
   */


  clone(rows, head, types) {
    var _this$rows2;

    return new Table(head || this.head.slice(), rows || (_this$rows2 = this.rows, veho.Mx.clone(_this$rows2)), this.title, types || this.types.slice());
  }

}

exports.Table = Table;
