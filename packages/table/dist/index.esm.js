import { slice, shallow } from '@analys/table-init';
import { tableFilter } from '@analys/table-filter';
import { tablePivot } from '@analys/table-pivot';
import { selectSamplesByHead, selectKeyedColumns } from '@analys/keyed-columns';
import { Samples } from 'veho';
import { StatMx } from 'borel';
import { DistinctCount, Distinct } from '@aryth/distinct-column';
import { NUM_ASC } from '@aryth/comparer';
import { size, transpose } from '@vect/matrix';
import { mapper as mapper$1 } from '@vect/vector-mapper';
import { splices as splices$1 } from '@vect/vector-update';
import { mapper } from '@vect/matrix-mapper';
import { mutate } from '@vect/column-mapper';
import { mapper as mapper$2 } from '@vect/columns-mapper';
import { push, unshift, pop, shift, splices } from '@vect/columns-update';
import { inferType } from '@typen/num-strict';

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
  const types = column.map(inferType);
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
   * @param {Object} o
   * @return {Table}
   */


  static from(o) {
    return new Table(o.head || o.banner, o.rows || o.matrix, o.title, o.types);
  }
  /**
   *
   * @param {str|[*,*]} [headFields]
   * @returns {Object[]}
   */


  toSamples(headFields) {
    return selectSamplesByHead.call(this, headFields);
  }
  /**
   *
   * @param {boolean} [mutate=false]
   * @returns {*}
   */


  toJson(mutate = false) {
    var _this, _this2;

    return mutate ? (_this = this, slice(_this)) : (_this2 = this, shallow(_this2));
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
    } = Samples.toTable(samples, {
      fields
    });
    return new Table(head, rows, title, types);
  }

  get size() {
    return size(this.rows);
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
    return transpose(this.rows);
  }

  cell(x, field) {
    return this.rows[x][this.coin(field)];
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
    return mutate(this.rows, this.coin(field), (_, i) => column[i], this.ht), this;
  }

  setColumnBy(field, fn) {
    return mutate(this.rows, this.coin(field), (x, i) => fn(x, i), this.ht), this;
  }

  pushRow(row) {
    return this.rows.push(row), this;
  }

  unshiftRow(row) {
    return this.rows.unshift(row), this;
  }

  pushColumn(label, col) {
    return this.head.push(label), push(this.rows, col), this;
  }

  unshiftColumn(label, col) {
    return this.head.unshift(label), unshift(this.rows, col), this;
  }

  popRow() {
    return this.rows.pop();
  }

  shiftRow() {
    return this.rows.shift();
  }

  popColumn() {
    return pop(this.rows);
  }

  shiftColumn() {
    return shift(this.rows);
  }

  map(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      rows: mapper(this.rows, fn, this.ht, this.wd)
    }, mutate);
  }

  mapHead(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      head: mapper$1(this.head, fn)
    }, mutate);
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

    let o = mutate ? this : (_this3 = this, slice(_this3));
    selectKeyedColumns.call(o, fields);
    return mutate ? this : this.copy(o);
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
    var _this4;

    const ys = fields.map(this.coin.bind(this)).sort(NUM_ASC);
    const o = mutate ? this : (_this4 = this, shallow(_this4));
    splices(o.rows, ys), splices$1(o.head, ys);
    return mutate ? this : Table.from(o);
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
    if (parser) mutate(this.rows, y, parser, this.ht), this.types[y] = typeName;
    return this;
  }
  /**
   * Re-generate this._types based on DPTyp.inferArr method.
   * Cautious: This method will change all elements of this._types.
   * @return {string[]}
   */


  mutInferTypes() {
    this.types = mapper$2(this.rows, inferArrayType);

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
    var _this5;

    const o = mutate ? this : (_this5 = this, slice(_this5));
    tableFilter.call(o, filterCollection);
    return mutate ? this : this.copy(o);
  }

  distinct(fields, {
    mutate = true
  } = {}) {
    var _this6;

    const o = mutate ? this : (_this6 = this, slice(_this6));

    for (let field of fields) o.rows = StatMx.distinct(o.rows, this.coin(field));

    return mutate ? this : this.copy(o);
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
    return count ? DistinctCount(this.coin(field))(this.rows, {
      l: this.ht,
      sort
    }) : Distinct(this.coin(field))(this.rows, this.ht);
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
    var _this7;

    const y = this.coin(field);

    const rowComparer = (a, b) => comparer(a[y], b[y]);

    const o = mutate ? this : (_this7 = this, slice(_this7));
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
    var _this8;

    let o = mutate ? this : (_this8 = this, slice(_this8));
    sortColumnsByKeys.call(o, comparer);
    return mutate ? this : this.copy(o);
  }
  /**
   *
   * @param {str} side
   * @param {str} banner
   * @param {CubeCell[]|CubeCell} [cell]
   * @param {Filter[]|Filter} [filter]
   * @param {function():number} formula - formula is valid only when cell is CubeCell array.
   * @returns {CrosTab}
   * @returns {CrosTab}
   */


  crosTab({
    side,
    banner,
    cell,
    filter,
    formula
  }) {
    return tablePivot(this, {
      side,
      banner,
      cell,
      filter,
      formula
    });
  }

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

}

export { Table };
