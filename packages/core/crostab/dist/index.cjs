'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var crostabInit = require('@analys/crostab-init');
var crostabLookup = require('@analys/crostab-lookup');
var keyedRows = require('@analys/keyed-rows');
var tabular = require('@analys/tabular');
var comparer = require('@aryth/comparer');
var columnGetter = require('@vect/column-getter');
var columnMapper = require('@vect/column-mapper');
var columnsUpdate = require('@vect/columns-update');
var enumMatrixDirections = require('@vect/enum-matrix-directions');
var matrixInit = require('@vect/matrix-init');
var matrixMapper = require('@vect/matrix-mapper');
var matrixAlgebra = require('@vect/matrix-algebra');
var objectInit = require('@vect/object-init');
var vectorMapper = require('@vect/vector-mapper');
var vectorAlgebra = require('@vect/vector-algebra');
var vectorZipper = require('@vect/vector-zipper');

/**
 *
 */

class Crostab {
  /** @type {*[]} */
  side;
  /** @type {*[]} */

  head;
  /** @type {*[][]} */

  rows;
  /** @type {string} */

  title;
  /**
   *
   * @param {*[]} side
   * @param {*[]} head
   * @param {*[][]} rows
   * @param {string} [title]
   */

  constructor(side, head, rows, title) {
    this.side = side;
    this.head = head;
    this.rows = rows;
    this.title = title || '';
  }

  static build(side, head, rows, title) {
    return new Crostab(side, head, rows, title);
  }

  static from(o) {
    let side = o.side,
        head = o.head || o.banner,
        rows = o.rows || o.matrix,
        title = o.title;
    if (side && head && !rows) rows = matrixInit.draft(side.length, head.length);
    return new Crostab(side, head, rows, title);
  }
  /**
   * Shallow copy
   * @param {*[]} side
   * @param {*[]} head
   * @param {function(number,number):*} func
   * @param {string} [title]
   * @return {Crostab}
   */


  static init({
    side,
    head,
    func,
    title
  }) {
    return new Crostab(side, head, matrixInit.init(side === null || side === void 0 ? void 0 : side.length, head === null || head === void 0 ? void 0 : head.length, (x, y) => func(x, y)), title);
  }

  static draft({
    side,
    head,
    value,
    title
  }) {
    const rows = matrixInit.iso(side.length, head.length, value);
    return new Crostab(side, head, rows, title);
  }

  rowwiseSamples(headFields, indexed = false, indexName = '_') {
    const samples = tabular.selectTabularToSamples.call(this, headFields);
    return indexed ? vectorZipper.zipper(this.side, samples, (l, s) => Object.assign(objectInit.pair(indexName, l), s)) : samples;
  }

  columnwiseSamples(sideFields, indexed = false, indexName = '_') {
    const samples = keyedRows.selectSamplesBySide.call(this, sideFields);
    return indexed ? vectorZipper.zipper(this.head, samples, (l, s) => Object.assign(objectInit.pair(indexName, l), s)) : samples;
  }

  toObject(mutate = false) {
    var _this, _this2;

    return mutate ? (_this = this, crostabInit.slice(_this)) : (_this2 = this, crostabInit.shallow(_this2));
  }

  toTable(sideLabel) {
    const head = vectorAlgebra.acquire([sideLabel], this.head);
    const rows = vectorZipper.zipper(this.side, this.rows, (x, row) => vectorAlgebra.acquire([x], row));
    return {
      head,
      rows
    };
  }
  /** @returns {*[][]} */


  get columns() {
    return matrixAlgebra.transpose(this.rows);
  }

  get size() {
    return [this.height, this.width];
  }

  get height() {
    var _this$side;

    return (_this$side = this.side) === null || _this$side === void 0 ? void 0 : _this$side.length;
  }

  get width() {
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
    return columnGetter.column(this.rows, this.coin(c), this.height);
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

  setCell(r, c, value) {
    if ((r = this.roin(r)) >= 0 && (c = this.coin(c)) >= 0) this.rows[r][c] = value;
  }

  setElement(x, y, value) {
    if (x >= 0 && y >= 0) this.rows[x][y] = value;
  }

  setRow(r, row) {
    return this.rows[this.roin(r)] = row, this;
  }

  setRowBy(r, fn) {
    return vectorMapper.mutate(this.row(r), fn, this.width), this;
  }

  setColumn(c, column) {
    return columnMapper.mutate(this.rows, this.coin(c), (_, i) => column[i], this.height), this;
  }

  setColumnBy(c, fn) {
    return columnMapper.mutate(this.rows, this.coin(c), fn, this.height), this;
  }

  map(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      rows: matrixMapper.mapper(this.rows, fn, this.height, this.width)
    }, mutate);
  }

  mapSide(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      side: vectorMapper.mapper(this.side, fn)
    }, mutate);
  }

  mapBanner(fn, {
    mutate = true
  } = {}) {
    return this.boot({
      head: vectorMapper.mapper(this.head, fn)
    }, mutate);
  }

  mutate(fn) {
    return matrixMapper.mutate(this.rows, fn, this.height, this.width), this;
  }

  mutateLabel(fn) {
    return vectorMapper.mutate(this.side, fn), vectorMapper.mutate(this.head, fn), this;
  }

  mutateSide(fn) {
    return vectorMapper.mutate(this.side, fn), this;
  }

  mutateHead(fn) {
    return vectorMapper.mutate(this.head, fn), this;
  }

  mutateBanner(fn) {
    return vectorMapper.mutate(this.head, fn), this;
  }

  pushRow(label, row) {
    return this.side.push(label), this.rows.push(row), this;
  }

  unshiftRow(label, row) {
    return this.side.unshift(label), this.rows.unshift(row), this;
  }

  pushColumn(label, col) {
    return this.head.push(label), columnsUpdate.push(this.rows, col), this;
  }

  unshiftColumn(label, col) {
    return this.head.unshift(label), columnsUpdate.unshift(this.rows, col), this;
  }

  popRow() {
    return [this.side.pop(), this.rows.pop()];
  }

  shiftRow() {
    return [this.side.shift(), this.rows.shift()];
  }

  popColumn() {
    return [this.head.pop(), columnsUpdate.pop(this.rows)];
  }

  shiftColumn() {
    return [this.head.shift(), columnsUpdate.shift(this.rows)];
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
    return (cached ? crostabLookup.vlookupCached : crostabLookup.vlookup).call(this, valueToFind, keyField, valueField);
  }

  vlookupMany(valuesToFind, keyField, valueField) {
    return crostabLookup.vlookupMany.call(this, valuesToFind, keyField, valueField);
  }

  vlookupTable(keyField, valueField) {
    return crostabLookup.vlookupTable.call(this, keyField, valueField);
  }

  hlookupOne(valueToFind, keyField, valueField, cached) {
    return (cached ? crostabLookup.hlookupCached : crostabLookup.hlookup).call(this, valueToFind, keyField, valueField);
  }

  hlookupMany(valuesToFind, keyField, valueField) {
    return crostabLookup.hlookupMany.call(this, valuesToFind, keyField, valueField);
  }

  hlookupTable(keyField, valueField) {
    return crostabLookup.hlookupTable.call(this, keyField, valueField);
  }

  selectRows(sideLabels, mutate = false) {
    var _this3;

    let o = mutate ? this : (_this3 = this, crostabInit.slice(_this3));
    keyedRows.selectKeyedRows.call(o, sideLabels);
    return mutate ? this : this.copy(o);
  }

  selectColumns(headLabels, mutate = false) {
    var _this4;

    let o = mutate ? this : (_this4 = this, crostabInit.slice(_this4));
    tabular.selectTabular.call(this, headLabels);
    return mutate ? this : this.copy(o);
  }

  select({
    side,
    head,
    mutate = false
  } = {}) {
    var _this5;

    let o = mutate ? this : (_this5 = this, crostabInit.slice(_this5));
    if (head !== null && head !== void 0 && head.length) tabular.selectTabular.call(o, head);
    if (side !== null && side !== void 0 && side.length) keyedRows.selectKeyedRows.call(o, side);
    return mutate ? this : this.copy(o);
  }

  sort({
    direct = enumMatrixDirections.ROWWISE,
    field,
    comparer: comparer$1 = comparer.NUM_ASC,
    mutate = false
  } = {}) {
    var _this6;

    let o = mutate ? this : (_this6 = this, crostabInit.slice(_this6));
    if (direct === enumMatrixDirections.ROWWISE) keyedRows.sortKeyedRows.call(o, comparer$1, this.coin(field));
    if (direct === enumMatrixDirections.COLUMNWISE) tabular.sortTabular.call(o, comparer$1, this.roin(field));
    return mutate ? this : this.copy(o);
  }

  sortByLabels({
    direct = enumMatrixDirections.ROWWISE,
    comparer: comparer$1 = comparer.STR_ASC,
    mutate = false
  }) {
    var _this7;

    let o = mutate ? this : (_this7 = this, crostabInit.slice(_this7));
    if (direct === enumMatrixDirections.ROWWISE) keyedRows.sortRowsByKeys.call(o, comparer$1);
    if (direct === enumMatrixDirections.COLUMNWISE) tabular.sortTabularByKeys.call(o, comparer$1);
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
    return new Crostab(side, head, rows, title);
  }

}

exports.CrosTab = Crostab;
exports.Crostab = Crostab;
