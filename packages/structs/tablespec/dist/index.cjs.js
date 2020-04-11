'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');
var enumPivotMode = require('@analys/enum-pivot-mode');
var vectorMapper = require('@vect/vector-mapper');
var mergeAcquire = require('@vect/merge-acquire');
var matrix = require('@vect/matrix');

const parseCell = (cell, defaultField) => {
  var _cell$field, _cell$mode;

  if (cell === void 0 || cell === null) return defaultCell(defaultField);

  switch (typeof cell) {
    case enumDataTypes.OBJ:
      if (Array.isArray(cell)) return cell.length ? vectorMapper.mapper(cell, cell => parseCell(cell, defaultField)) : defaultCell(defaultField);
      cell.field = (_cell$field = cell.field) !== null && _cell$field !== void 0 ? _cell$field : defaultField;
      cell.mode = (_cell$mode = cell.mode) !== null && _cell$mode !== void 0 ? _cell$mode : enumPivotMode.COUNT;
      return cell;

    case enumDataTypes.STR:
    case enumDataTypes.NUM:
      return {
        field: cell,
        mode: enumPivotMode.INCRE
      };

    default:
      return defaultCell(defaultField);
  }
};

const defaultCell = defaultField => ({
  field: defaultField,
  mode: enumPivotMode.COUNT
});

/**
 *
 * @param {*} field
 * @param {str} neglect - default field
 * @returns {[str,number]|[str,number][]}
 */

const parseField = (field, neglect) => {
  if (field === void 0 || field === null) return [neglect, enumPivotMode.COUNT];
  let t = typeof field,
      ents;

  if (t === enumDataTypes.OBJ) {
    if (Array.isArray(field) && (ents = [])) {
      field.map(subField => parseField(subField, neglect)).forEach(subField => matrix.isMatrix(subField) ? mergeAcquire.acquire(ents, subField) : ents.push(subField));
    } else {
      ents = Object.entries(field);
    }

    if (ents.length === 0) return [neglect, enumPivotMode.COUNT];
    if (ents.length === 1) return ents[0];
    return ents;
  }

  if (t === enumDataTypes.STR || t === enumDataTypes.NUM) return [field, enumPivotMode.INCRE];
  return [neglect, enumPivotMode.COUNT];
};

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

class TableSpec {
  /** @type {TableObject} */

  /** @type {str} */

  /** @type {str} */

  /** @type {CubeCell[]|CubeCell} */

  /** @type {Filter[]|Filter} */

  /** @type {function():number} */

  /**
   * @param {str} side
   * @param {str} banner
   * @param {CubeCell[]|CubeCell} [cell]
   * @param {Filter[]|Filter} [filter]
   * @param {function():number} formula - formula is valid only when cell is CubeCell array.
   */
  constructor(side, banner, cell, filter, formula) {
    _defineProperty(this, "table", void 0);

    _defineProperty(this, "side", void 0);

    _defineProperty(this, "banner", void 0);

    _defineProperty(this, "cell", void 0);

    _defineProperty(this, "filter", void 0);

    _defineProperty(this, "formula", void 0);

    Object.assign(this, {
      side,
      banner,
      cell,
      filter,
      formula
    });
  }
  /**
   * @param {str} side
   * @param {str} banner
   * @param {CubeCell[]|CubeCell} [cell]
   * @param {Filter[]|Filter} [filter]
   * @param {function():number} formula - formula is valid only when cell is CubeCell array.
   */


  static build({
    side,
    banner,
    cell,
    filter,
    formula
  }) {
    return new TableSpec(side, banner, cell, filter, formula);
  }

  toObject() {
    const {
      side,
      banner,
      cell,
      filter,
      formula
    } = this;
    return {
      side,
      banner,
      cell,
      filter,
      formula
    };
  }

}

exports.TableSpec = TableSpec;
exports.parseCell = parseCell;
exports.parseField = parseField;
