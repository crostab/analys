'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var veho = require('veho');
var comparer = require('@aryth/comparer');
var vectorMapper = require('@vect/vector-mapper');
var vectorZipper = require('@vect/vector-zipper');
var matrix = require('@vect/matrix');
var matrixInit = require('@vect/matrix-init');
var matrixMapper = require('@vect/matrix-mapper');
var columnMapper = require('@vect/column-mapper');
var columnGetter = require('@vect/column-getter');
var columnsUpdate = require('@vect/columns-update');

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

const unwind = (entries, h) => {
  h = h || entries && entries.length;
  let keys = Array(h),
      values = Array(h);

  for (let r; --h >= 0 && (r = entries[h]);) {
    keys[h] = r[0];
    values[h] = r[1];
  }

  return [keys, values];
};

const select = (vec, indexes, hi) => {
  hi = hi || indexes.length;
  const vc = Array(hi);

  for (--hi; hi >= 0b0; hi--) vc[hi] = vec[indexes[hi]];

  return vc;
};

const selectKeyedRows = function (labels) {
  var _lookupIndexes$call;

  let {
    rows
  } = this,
      side,
      indexes;
  [side, indexes] = (_lookupIndexes$call = lookupIndexes.call(this, labels), unwind(_lookupIndexes$call));
  rows = select(rows, indexes);
  return {
    side,
    rows
  };
};
/**
 *
 * @param {(str|[*,*])[]} labels
 * @returns {[str,number][]}
 */

const lookupIndexes = function (labels) {
  return vectorMapper.mapper.call(this, labels, lookupIndex);
};
/**
 *
 * @param {str|[*,*]} [label]
 * @returns {[str,number]}
 */

const lookupIndex = function (label) {
  const {
    side
  } = this;
  if (!Array.isArray(label)) return [label, side.indexOf(label)];
  let [current, projected] = label;
  return [projected, side.indexOf(current)];
};

/**
 * @param {*[][]} mx
 * @param {number[]} ys
 * @returns {*}
 */

const select$1 = (mx, ys) => {
  const hi = ys.length;
  if (hi === 0) return mx;
  if (hi === 1) return columnGetter.column(mx, ys[0]);
  return mx.map(row => select(row, ys, hi));
};

const selectKeyedColumns = function (labels) {
  var _lookupIndexes$call;

  let {
    rows
  } = this,
      head,
      indexes;
  [head, indexes] = (_lookupIndexes$call = lookupIndexes$1.call(this, labels), unwind(_lookupIndexes$call));
  rows = select$1(rows, indexes);
  return {
    head,
    rows
  };
};
/**
 *
 * @param {(str|[*,*])[]} labels
 * @returns {[str,number][]}
 */

const lookupIndexes$1 = function (labels) {
  return vectorMapper.mapper.call(this, labels, lookupIndex$1);
};
/**
 *
 * @param {str|[*,*]} [label]
 * @returns {[str,number]}
 */

const lookupIndex$1 = function (label) {
  const {
    head
  } = this;
  if (!Array.isArray(label)) return [label, head.indexOf(label)];
  let [current, projected] = label;
  return [projected, head.indexOf(current)];
};

const toKeyComparer = comparer => {
  return (a, b) => comparer(a[0], b[0]);
};

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {{side:*[], rows:*[][]}}
 */

const sortKeyedRows = function (comparer, index) {
  var _zipper$sort;

  if (index < 0) return sortRowsByKeys.call(this, comparer);
  let {
    side,
    rows
  } = this;
  /** Columns of [row[i]s, side, rows]  */

  const Cols = (_zipper$sort = vectorZipper.zipper(side, rows, (key, row) => [row[index], key, row]).sort(toKeyComparer(comparer)), columnGetter.Columns(_zipper$sort));
  return {
    side: Cols(1),
    rows: Cols(2)
  };
};
/**
 *
 * @param comparer
 * @returns {{side:*[], rows:*[][]}}
 */

const sortRowsByKeys = function (comparer) {
  var _zipper$sort2;

  let {
    side,
    rows
  } = this;
  [side, rows] = (_zipper$sort2 = vectorZipper.zipper(side, rows, (key, row) => [key, row]).sort(toKeyComparer(comparer)), unwind(_zipper$sort2));
  return {
    side,
    rows
  };
};

/**
 * Transpose a 2d-array.
 * @param {*[][]} mx
 * @param {number} [h]
 * @param {number} [w]
 * @returns {*[][]}
 */

const transpose = (mx, h, w) => {
  var _mx$;

  h = h || (mx === null || mx === void 0 ? void 0 : mx.length), w = w || h && ((_mx$ = mx[0]) === null || _mx$ === void 0 ? void 0 : _mx$.length);
  const cols = Array(w);

  for (--w; w >= 0; w--) cols[w] = vectorMapper.mapper(mx, r => r[w], h);

  return cols;
};

/**
 * If y >= 0 then sort by vector[y] for each vectors, else (e.g. y===undefined) sort by keys.
 * @param {function(*,*):number} comparer
 * @param {number} [index]
 * @returns {{head:*[], rows:*[][]}}
 */

const sortKeyedColumns = function (comparer, index) {
  var _zipper$sort;

  if (index < 0) return sortColumnsByKeys.call(this, comparer);
  let {
    head,
    rows
  } = this,
      columns = transpose(rows);
  /** [column[i]s, head, columns]  */

  const Keyed = (_zipper$sort = vectorZipper.zipper(head, columns, (key, column) => [column[index], key, column]).sort(toKeyComparer(comparer)), columnGetter.Columns(_zipper$sort));
  return {
    head: Keyed(1),
    rows: transpose(Keyed(2))
  };
};
/**
 *
 * @param comparer
 * @returns {{head:*[], rows:*[][]}}
 */

const sortColumnsByKeys = function (comparer) {
  var _zipper$sort2;

  let {
    head,
    rows
  } = this,
      columns = transpose(rows);
  [head, columns] = (_zipper$sort2 = vectorZipper.zipper(head, columns, (key, row) => [key, row]).sort(toKeyComparer(comparer)), unwind(_zipper$sort2));
  rows = transpose(columns);
  return {
    head,
    rows
  };
};

const selectSamples = function (fieldIndexPairs) {
  const {
    rows
  } = this,
        depth = fieldIndexPairs === null || fieldIndexPairs === void 0 ? void 0 : fieldIndexPairs.length;
  return vectorMapper.mapper(rows, row => {
    let o = {};
    vectorMapper.iterate(fieldIndexPairs, ([field, index]) => o[field] = row[index], depth);
    return o;
  });
};
/**
 *
 * @param {(str|[*,*])[]} labels
 * @returns {[str,number][]}
 */


const lookupIndexes$2 = function (labels) {
  return vectorMapper.mapper.call(this, labels, lookupIndex$2);
};
/**
 *
 * @param {str|[*,*]} [label]
 * @returns {[str,number]}
 */


const lookupIndex$2 = function (label) {
  const {
    head
  } = this;
  if (!Array.isArray(label)) return [label, head.indexOf(label)];
  let [current, projected] = label;
  return [projected, head.indexOf(current)];
};

const selectSamplesByHead = function (labels) {
  const fieldIndexes = lookupIndexes$2.call(this, labels);
  return selectSamples.call(this, fieldIndexes);
};

const selectSamples$1 = function (fieldIndexPairs) {
  const {
    rows
  } = this,
        columns = transpose(rows),
        depth = fieldIndexPairs === null || fieldIndexPairs === void 0 ? void 0 : fieldIndexPairs.length;
  return vectorMapper.mapper(columns, column => {
    let o = {};
    vectorMapper.iterate(fieldIndexPairs, ([field, index]) => o[field] = column[index], depth);
    return o;
  });
};
/**
 *
 * @param {(str|[*,*])[]} labels
 * @returns {[str,number][]}
 */


const lookupIndexes$3 = function (labels) {
  return vectorMapper.mapper.call(this, labels, lookupIndex$3);
};
/**
 *
 * @param {str|[*,*]} [label]
 * @returns {[str,number]}
 */


const lookupIndex$3 = function (label) {
  const {
    side
  } = this;
  if (!Array.isArray(label)) return [label, side.indexOf(label)];
  let [current, projected] = label;
  return [projected, side.indexOf(current)];
};

const selectSamplesBySide = function (labels) {
  const fieldIndexes = lookupIndexes$3.call(this, labels);
  return selectSamples$1.call(this, fieldIndexes);
};

const ob = (indexName, indexValue) => {
  const o = {};
  o[indexName] = indexValue;
  return o;
};

/**
 * A number, or a string containing a number.
 * @typedef {(number|string)} str
 * @typedef {{field:str,mode:number,filter:}} CubeCell
 * @typedef {{field:str,filter:function(*):boolean}} Filter
 * @typedef {{
 *  side:string,
 *  head:string,
 *  filter:Filter[]|Filter,
 *  cell:CubeCell[]|CubeCell,
 *  formula:function():number,
 * }} TableSpec
 */

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

  static from(ob) {
    const side = ob.side,
          head = ob.head || ob.banner || [],
          rows = ob.rows || ob.matrix || [[]],
          title = ob.title || '';
    return new CrosTab(side, head, rows, title);
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
    const rows = matrixInit.init(side === null || side === void 0 ? void 0 : side.length, head === null || head === void 0 ? void 0 : head.length, (x, y) => func(x, y));
    return CrosTab.from({
      side,
      head,
      rows,
      title
    });
  }

  rowwiseSamples(headFields, indexed = false, indexName = '_') {
    const samples = selectSamplesByHead.call(this, headFields);
    return indexed ? vectorZipper.zipper(this.side, samples, (l, s) => Object.assign(ob(indexName, l), s)) : samples;
  }

  columnwiseSamples(sideFields, indexed = false, indexName = '_') {
    const samples = selectSamplesBySide.call(this, sideFields);
    return indexed ? vectorZipper.zipper(this.head, samples, (l, s) => Object.assign(ob(indexName, l), s)) : samples;
  }

  get toJson() {
    var _this$rows;

    return {
      side: this.side.slice(),
      head: this.head.slice(),
      rows: (_this$rows = this.rows, veho.clone(_this$rows)),
      title: this.title
    };
  }
  /** @returns {*[][]} */


  get columns() {
    return matrix.transpose(this.rows);
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
    return (r = this.row(this.roin(r))) ? r[this.coin(c)] : null;
  }

  element(x, y) {
    return this.rows[x][y];
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
    return columnGetter.column(this.rows, this.coin(c), this.ht);
  }

  transpose(newTitle, {
    mutate = true
  } = {}) {
    const {
      head: side,
      side: head,
      columns: rows
    } = this;
    return this.boot(mutate, {
      rows,
      side,
      head
    });
  }

  setRow(r, row) {
    return this.rows[this.roin(r)] = row, this;
  }

  setRowBy(r, fn) {
    return vectorMapper.mutate(this.row(r), fn, this.wd), this;
  }

  setColumn(c, column) {
    return columnMapper.mutate(this.rows, this.coin(c), (_, i) => column[i], this.ht), this;
  }

  setColumnBy(c, fn) {
    return columnMapper.mutate(this.rows, this.coin(c), fn, this.ht), this;
  }

  map(fn, {
    mutate = true
  } = {}) {
    return this.boot(mutate, {
      rows: matrixMapper.mapper(this.rows, fn, this.ht, this.wd)
    });
  }

  mapSide(fn, {
    mutate = true
  } = {}) {
    return this.boot(mutate, {
      side: vectorMapper.mapper(this.side, fn)
    });
  }

  mapBanner(fn, {
    mutate = true
  } = {}) {
    return this.boot(mutate, {
      head: vectorMapper.mapper(this.head, fn)
    });
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

  selectRows(sideLabels, mutate = false) {
    const {
      side,
      rows
    } = selectKeyedRows.call(this, sideLabels);
    return this.boot(mutate, {
      side,
      rows
    });
  }

  selectColumns(headLabels, mutate = false) {
    const {
      head,
      rows
    } = selectKeyedColumns.call(this, headLabels);
    return this.boot(mutate, {
      head,
      rows
    });
  }

  select({
    side: sls,
    head: bls,
    mutate = false
  } = {}) {
    let {
      rows,
      side,
      head
    } = this;
    if (bls === null || bls === void 0 ? void 0 : bls.length) ({
      head,
      rows
    } = selectKeyedColumns.call({
      head,
      rows
    }, bls));
    if (sls === null || sls === void 0 ? void 0 : sls.length) ({
      side,
      rows
    } = selectKeyedRows.call({
      side,
      rows
    }, sls));
    return this.boot(mutate, {
      rows,
      side,
      head
    });
  }

  slice({
    top,
    bottom,
    left,
    right,
    mutate = true
  } = {}) {
    let {
      side: s,
      head: b,
      rows: mx
    } = this;
    if (top || bottom) s = s.slice(top, bottom), mx = mx.slice(top, bottom);
    if (left || right) b = b.slice(left, right), mx = mx.map(row => row.slice(left, right));
    return this.boot(mutate, {
      rows: mx,
      side: s,
      head: b
    });
  }

  sort({
    direct = matrix.ROWWISE,
    field,
    comparer: comparer$1 = comparer.NUM_ASC,
    mutate = false
  } = {}) {
    let {
      side,
      head,
      rows
    } = this;
    if (direct === matrix.ROWWISE) ({
      side,
      rows
    } = sortKeyedRows.call({
      side,
      rows
    }, comparer$1, this.coin(field)));
    if (direct === matrix.COLUMNWISE) ({
      head,
      rows
    } = sortKeyedColumns.call({
      head,
      rows
    }, comparer$1, this.roin(field)));
    return this.boot(mutate, {
      rows,
      side,
      head
    });
  }

  sortByLabels({
    direct = matrix.ROWWISE,
    comparer: comparer$1 = comparer.STR_ASC,
    mutate = false
  }) {
    let {
      side,
      head,
      rows
    } = this;
    if (direct === matrix.ROWWISE) ({
      side,
      rows
    } = sortRowsByKeys.call({
      side,
      rows
    }, comparer$1));
    if (direct === matrix.COLUMNWISE) ({
      head,
      rows
    } = sortColumnsByKeys.call({
      head,
      rows
    }, comparer$1));
    return this.boot(mutate, {
      rows,
      side,
      head
    });
  }

  boot(mutate, {
    rows,
    side,
    head
  } = {}) {
    return mutate ? this.reboot(rows, side, head) : this.clone(rows, side, head);
  }
  /**
   *
   * @param {*[][]} [rows]
   * @param {*[]} [side]
   * @param {*[]} [head]
   * @returns {CrosTab}
   */


  reboot(rows, side, head) {
    if (rows) this.rows = rows;
    if (side) this.side = side;
    if (head) this.head = head;
    return this;
  }
  /**
   * Shallow copy
   * @param {*[][]} [rows]
   * @param {*[]} [side]
   * @param {*[]} [head]
   * @return {CrosTab}
   */


  clone(rows, side, head) {
    return new CrosTab(side || this.side.slice(), head || this.head.slice(), rows || veho.Mx.clone(this.rows), this.title);
  }

}

exports.CrosTab = CrosTab;
