import { slice, shallow } from '@analys/crostab-init';
import { vlookupCached, vlookup, vlookupMany, vlookupTable, hlookupCached, hlookup, hlookupMany, hlookupTable } from '@analys/crostab-lookup';
import { selectSamplesByHead, selectKeyedColumns, sortKeyedColumns, sortColumnsByKeys } from '@analys/keyed-columns';
import { selectSamplesBySide, selectKeyedRows, sortKeyedRows, sortRowsByKeys } from '@analys/keyed-rows';
import { NUM_ASC, STR_ASC } from '@aryth/comparer';
import { column } from '@vect/column-getter';
import { mutate as mutate$1 } from '@vect/column-mapper';
import { push, unshift, pop, shift } from '@vect/columns-update';
import { ROWWISE, COLUMNWISE } from '@vect/enum-matrix-directions';
import { init } from '@vect/matrix-init';
import { mapper } from '@vect/matrix-mapper';
import { transpose } from '@vect/matrix-transpose';
import { pair } from '@vect/object-init';
import { mutate, mapper as mapper$1 } from '@vect/vector-mapper';
import { zipper } from '@vect/vector-zipper';

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

/**
 *
 */

class CrosTab {
  /** @type {*[]} */

  /** @type {*[]} */

  /** @type {*[][]} */

  /** @type {string} */

  /**
   *
   * @param {*[]} side
   * @param {*[]} head
   * @param {*[][]} rows
   * @param {string} [title]
   */
  constructor(side, head, rows, title) {
    _defineProperty(this, "side", void 0);

    _defineProperty(this, "head", void 0);

    _defineProperty(this, "rows", void 0);

    _defineProperty(this, "title", void 0);

    this.side = side;
    this.head = head;
    this.rows = rows;
    this.title = title || '';
  }

  static from(o) {
    return new CrosTab(o.side, o.head || o.banner, o.rows || o.matrix, o.title);
  }
  /**
   * Shallow copy
   * @param {*[]} side
   * @param {*[]} head
   * @param {function(number,number):*} func
   * @param {string} [title]
   * @return {CrosTab}
   */


  static init({
    side,
    head,
    func,
    title
  }) {
    return CrosTab.from({
      side,
      head,
      rows: init(side === null || side === void 0 ? void 0 : side.length, head === null || head === void 0 ? void 0 : head.length, (x, y) => func(x, y)),
      title
    });
  }

  rowwiseSamples(headFields, indexed = false, indexName = '_') {
    const samples = selectSamplesByHead.call(this, headFields);
    return indexed ? zipper(this.side, samples, (l, s) => Object.assign(pair(indexName, l), s)) : samples;
  }

  columnwiseSamples(sideFields, indexed = false, indexName = '_') {
    const samples = selectSamplesBySide.call(this, sideFields);
    return indexed ? zipper(this.head, samples, (l, s) => Object.assign(pair(indexName, l), s)) : samples;
  }

  toObject(mutate = false) {
    var _this, _this2;

    return mutate ? (_this = this, slice(_this)) : (_this2 = this, shallow(_this2));
  }
  /** @returns {*[][]} */


  get columns() {
    return transpose(this.rows);
  }

  get size() {
    return [this.ht, this.wd];
  }

  get ht() {
    var _this$side;

    return (_this$side = this.side) === null || _this$side === void 0 ? void 0 : _this$side.length;
  }

  get wd() {
    var _this$head;

    return (_this$head = this.head) === null || _this$head === void 0 ? void 0 : _this$head.length;
  }

  roin(r) {
    return this.side.indexOf(r);
  }

  coin(c) {
    return this.head.indexOf(c);
  }

  cell(r, c) {
    return this.element(this.roin(r), this.coin(c));
  }

  element(x, y) {
    return x in this.rows ? this.rows[x][y] : undefined;
  }

  coordinate(r, c) {
    return {
      x: this.roin(r),
      y: this.coin(c)
    };
  }

  row(r) {
    return this.rows[this.roin(r)];
  }

  column(c) {
    return column(this.rows, this.coin(c), this.ht);
  }

  transpose(title, {
    mutate = true
  } = {}) {
    return this.boot({
      side: this.head,
      head: this.side,
      rows: this.columns,
      title
    }, mutate);
  }

  setRow(r, row) {
    return this.rows[this.roin(r)] = row, this;
  }

  setRowBy(r, fn) {
    return mutate(this.row(r), fn, this.wd), this;
  }

  setColumn(c, column) {
    return mutate$1(this.rows, this.coin(c), (_, i) => column[i], this.ht), this;
  }

  setColumnBy(c, fn) {
    return mutate$1(this.rows, this.coin(c), fn, this.ht), this;
  }

  map(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      rows: mapper(this.rows, fn, this.ht, this.wd)
    }, mutate);
  }

  mapSide(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      side: mapper$1(this.side, fn)
    }, mutate);
  }

  mapBanner(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      head: mapper$1(this.head, fn)
    }, mutate);
  }

  pushRow(label, row) {
    return this.side.push(label), this.rows.push(row), this;
  }

  unshiftRow(label, row) {
    return this.side.unshift(label), this.rows.unshift(row), this;
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

  slice({
    top,
    bottom,
    left,
    right,
    mutate = true
  } = {}) {
    let {
      side,
      head,
      rows
    } = this;
    if (top || bottom) side = side.slice(top, bottom), rows = rows.slice(top, bottom);
    if (left || right) head = head.slice(left, right), rows = rows.map(row => row.slice(left, right));
    return this.boot({
      side,
      head,
      rows
    }, mutate);
  }

  vlookupOne(valueToFind, keyField, valueField, cached) {
    return (cached ? vlookupCached : vlookup).call(this, valueToFind, keyField, valueField);
  }

  vlookupMany(valuesToFind, keyField, valueField) {
    return vlookupMany.call(this, valuesToFind, keyField, valueField);
  }

  vlookupTable(keyField, valueField) {
    return vlookupTable.call(this, keyField, valueField);
  }

  hlookupOne(valueToFind, keyField, valueField, cached) {
    return (cached ? hlookupCached : hlookup).call(this, valueToFind, keyField, valueField);
  }

  hlookupMany(valuesToFind, keyField, valueField) {
    return hlookupMany.call(this, valuesToFind, keyField, valueField);
  }

  hlookupTable(keyField, valueField) {
    return hlookupTable.call(this, keyField, valueField);
  }

  selectRows(sideLabels, mutate = false) {
    var _this3;

    let o = mutate ? this : (_this3 = this, slice(_this3));
    selectKeyedRows.call(o, sideLabels);
    return mutate ? this : this.copy(o);
  }

  selectColumns(headLabels, mutate = false) {
    var _this4;

    let o = mutate ? this : (_this4 = this, slice(_this4));
    selectKeyedColumns.call(this, headLabels);
    return mutate ? this : this.copy(o);
  }

  select({
    side,
    head,
    mutate = false
  } = {}) {
    var _this5;

    let o = mutate ? this : (_this5 = this, slice(_this5));
    if (head === null || head === void 0 ? void 0 : head.length) selectKeyedColumns.call(o, head);
    if (side === null || side === void 0 ? void 0 : side.length) selectKeyedRows.call(o, side);
    return mutate ? this : this.copy(o);
  }

  sort({
    direct = ROWWISE,
    field,
    comparer = NUM_ASC,
    mutate = false
  } = {}) {
    var _this6;

    let o = mutate ? this : (_this6 = this, slice(_this6));
    if (direct === ROWWISE) sortKeyedRows.call(o, comparer, this.coin(field));
    if (direct === COLUMNWISE) sortKeyedColumns.call(o, comparer, this.roin(field));
    return mutate ? this : this.copy(o);
  }

  sortByLabels({
    direct = ROWWISE,
    comparer = STR_ASC,
    mutate = false
  }) {
    var _this7;

    let o = mutate ? this : (_this7 = this, slice(_this7));
    if (direct === ROWWISE) sortRowsByKeys.call(o, comparer);
    if (direct === COLUMNWISE) sortColumnsByKeys.call(o, comparer);
    return mutate ? this : this.copy(o);
  }

  boot({
    side,
    head,
    rows,
    title
  } = {}, mutate) {
    if (mutate) {
      if (side) this.side = side;
      if (head) this.head = head;
      if (rows) this.rows = rows;
      if (title) this.title = title;
      return this;
    } else {
      return this.copy({
        side,
        head,
        rows,
        title
      });
    }
  }

  copy({
    side,
    head,
    rows,
    title
  } = {}) {
    if (!side) side = this.side.slice();
    if (!head) head = this.head.slice();
    if (!rows) rows = this.rows.map(row => row.slice());
    if (!title) title = this.title;
    return new CrosTab(side, head, rows, title);
  }

}

export { CrosTab };
