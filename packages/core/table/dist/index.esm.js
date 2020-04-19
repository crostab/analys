import { selectSamplesByHead, keyedColumnsToSamples, selectKeyedColumns, sortColumnsByKeys } from '@analys/keyed-columns';
import { tableChips } from '@analys/table-chips';
import { tableDivide } from '@analys/table-divide';
import { tableFilter } from '@analys/table-filter';
import { tableFind } from '@analys/table-find';
import { tableFormula } from '@analys/table-formula';
import { tableGroup } from '@analys/table-group';
import { slice, shallow } from '@analys/table-init';
import { tableJoin } from '@analys/table-join';
import { lookupCached, lookup, lookupMany, lookupTable } from '@analys/table-lookup';
import { tableAcquire, tableMerge } from '@analys/table-merge';
import { tablePivot } from '@analys/table-pivot';
import { inferTypes } from '@analys/table-types';
import { NUM_ASC } from '@aryth/comparer';
import { DistinctCount, Distinct } from '@aryth/distinct-column';
import { column } from '@vect/column-getter';
import { mutate } from '@vect/column-mapper';
import { push, unshift, pop, shift, splices } from '@vect/columns-update';
import { size, transpose } from '@vect/matrix';
import { mapper as mapper$1, mutate as mutate$1, selectMutate } from '@vect/matrix-mapper';
import { difference, intersect } from '@vect/vector-algebra';
import { mapper, iterate } from '@vect/vector-mapper';
import { splices as splices$1 } from '@vect/vector-update';
import { StatMx } from 'borel';

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

  toSamples(fields) {
    return fields ? selectSamplesByHead.call(this, fields) : keyedColumnsToSamples.call(this);
  }

  toObject(mutate = false) {
    var _this, _this2;

    return mutate ? (_this = this, slice(_this)) : (_this2 = this, shallow(_this2));
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
    return x in this.rows ? this.rows[x][this.coin(field)] : undefined;
  }

  coin(field) {
    return this.head.indexOf(field);
  }

  columnIndexes(fields) {
    return fields.map(this.coin, this);
  }

  column(field) {
    return column(this.rows, this.coin(field), this.ht);
  }

  setColumn(field, column) {
    return mutate(this.rows, this.coin(field), (_, i) => column[i], this.ht), this;
  }

  mutateColumn(field, fn) {
    return mutate(this.rows, this.coin(field), (x, i) => fn(x, i), this.ht), this;
  }

  pushRow(row) {
    return this.rows.push(row), this;
  }

  unshiftRow(row) {
    return this.rows.unshift(row), this;
  }

  pushColumn(label, column) {
    return this.head.push(label), push(this.rows, column), this;
  }

  unshiftColumn(label, column) {
    return this.head.unshift(label), unshift(this.rows, column), this;
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

  renameColumn(field, newName) {
    const ci = this.coin(field);
    if (ci >= 0) this.head[ci] = newName;
  }

  mapHead(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      head: mapper(this.head, fn)
    }, mutate);
  }

  map(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      rows: mapper$1(this.rows, fn, this.ht, this.wd)
    }, mutate);
  }

  mutate(fn, {
    fields,
    exclusive
  } = {}) {
    var _fields;

    if (!fields && !exclusive) return mutate$1(this.rows, fn, this.ht, this.wd), this;
    fields = (_fields = fields) !== null && _fields !== void 0 ? _fields : this.head;
    fields = exclusive ? difference(fields, exclusive) : fields;
    return selectMutate(this.rows, this.columnIndexes(fields), fn, this.ht), this;
  }

  lookupOne(valueToFind, key, field, cached = true) {
    return (cached ? lookupCached : lookup).call(this, valueToFind, key, field);
  }

  lookupMany(valuesToFind, key, field) {
    return lookupMany.call(this, valuesToFind, key, field);
  }

  lookupTable(key, field, objectify) {
    return lookupTable.call(this, key, field, objectify);
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
    let o = mutate ? this : slice(this);
    selectKeyedColumns.call(o, fields);
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
    var _this3;

    const o = mutate ? this : (_this3 = this, shallow(_this3)),
          index = this.coin(field) + 1;
    o.head.splice(index, 0, label);
    iterate(o.rows, (row, i) => row.splice(index, 0, column[i]));
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
    var _this4;

    const o = mutate ? this : (_this4 = this, shallow(_this4)),
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
    var _this5;

    const o = mutate ? this : (_this5 = this, shallow(_this5)),
          indexes = this.columnIndexes(fields).sort(NUM_ASC);
    splices(o.rows, indexes), splices$1(o.head, indexes);
    return mutate ? this : this.copy(o);
  }

  divide(fields, {
    mutate = false
  } = {}) {
    var _this6;

    const o = mutate ? this : (_this6 = this, shallow(_this6));
    const {
      pick,
      rest
    } = tableDivide.call(o, fields);
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
    var _this7;

    const o = mutate ? this : (_this7 = this, slice(_this7));
    tableFilter.call(o, filterCollection);
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
    var _this8;

    const o = mutate ? this : (_this8 = this, slice(_this8));
    tableFind.call(o, filter);
    return mutate ? this : this.copy(o);
  }

  distinct(fields, {
    mutate = true
  } = {}) {
    var _this9;

    const o = mutate ? this : (_this9 = this, slice(_this9));

    for (let field of fields) o.rows = StatMx.distinct(o.rows, this.coin(field));

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
    var _this10;

    const y = this.coin(field);

    const rowComparer = (a, b) => comparer(a[y], b[y]);

    const o = mutate ? this : (_this10 = this, slice(_this10));
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
    var _this11;

    let o = mutate ? this : (_this11 = this, slice(_this11));
    sortColumnsByKeys.call(o, comparer);
    return mutate ? this : this.copy(o);
  }

  join(another, fields, joinType, fillEmpty) {
    return Table.from(tableJoin(this, another, fields, joinType, fillEmpty));
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
    const shared = intersect(self.head, another.head);

    if (shared.length) {
      for (let label of shared) self.setColumn(label, another.column(label));

      another = another.spliceColumns(shared, {
        mutate
      });
    }

    return mutate ? tableAcquire(self, another) : this.copy(tableMerge(self, another));
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
    return tableChips.call(this, options);
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
    return Table.from(tableGroup.call(this, options));
  }
  /**
   * @param {Object} options
   * @param {Object|Array} [formulae]
   * @param {Function} [options.filter]
   * @param {boolean} [options.append=true]
   * @return {Table}
   */


  formula(formulae, options = {}) {
    return Table.from(tableFormula.call(this, formulae, options));
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
    return tablePivot.call(this, options);
  }

  inferTypes({
    inferType,
    omitNull = true,
    mutate = false
  } = {}) {
    const types = inferTypes.call(this, {
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
        types,
        head,
        rows
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

export { Table };
