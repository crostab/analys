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
var matrixTranspose = require('@vect/matrix-transpose');
var objectInit = require('@vect/object-init');
var vectorMapper = require('@vect/vector-mapper');
var vectorMerge = require('@vect/vector-merge');
var vectorZipper = require('@vect/vector-zipper');

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
    this.side = void 0;
    this.head = void 0;
    this.rows = void 0;
    this.title = void 0;
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
      rows: matrixInit.init(side == null ? void 0 : side.length, head == null ? void 0 : head.length, (x, y) => func(x, y)),
      title
    });
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
    const head = vectorMerge.acquire([sideLabel], this.head);
    const rows = vectorZipper.zipper(this.side, this.rows, (x, row) => vectorMerge.acquire([x], row));
    return {
      head,
      rows
    };
  }
  /** @returns {*[][]} */


  get columns() {
    return matrixTranspose.transpose(this.rows);
  }

  get size() {
    return [this.height, this.width];
  }

  get height() {
    var _this$side;

    return (_this$side = this.side) == null ? void 0 : _this$side.length;
  }

  get width() {
    var _this$head;

    return (_this$head = this.head) == null ? void 0 : _this$head.length;
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

  mutateSide(fn) {
    return vectorMapper.mutate(this.side, fn), this;
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
    if (head != null && head.length) tabular.selectTabular.call(o, head);
    if (side != null && side.length) keyedRows.selectKeyedRows.call(o, side);
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
    return new CrosTab(side, head, rows, title);
  }

}

exports.CrosTab = CrosTab;
