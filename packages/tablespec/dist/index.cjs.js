'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumPivotMode = require('@analys/enum-pivot-mode');
var vectorMapper = require('@vect/vector-mapper');
var enumDataTypes = require('@typen/enum-data-types');
var mergeAcquire = require('@vect/merge-acquire');
var matrix = require('@vect/matrix');

// from x => typeof x
const NUM = 'number';
const STR = 'string';
const OBJ = 'object';

const parseCell = (cell, defaultField) => {
  var _cell$field, _cell$mode;

  if (cell === void 0 || cell === null) return defaultCell(defaultField);

  switch (typeof cell) {
    case OBJ:
      if (Array.isArray(cell)) return cell.length ? vectorMapper.mapper(cell, cell => parseCell(cell, defaultField)) : defaultCell(defaultField);
      cell.field = (_cell$field = cell.field) !== null && _cell$field !== void 0 ? _cell$field : defaultField;
      cell.mode = (_cell$mode = cell.mode) !== null && _cell$mode !== void 0 ? _cell$mode : enumPivotMode.COUNT;
      return cell;

    case STR:
    case NUM:
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
 * @param {*} fieldSet
 * @param {str} def - default field
 * @returns {[str,number]|[str,number][]}
 */

const parseFieldSet = (fieldSet, def) => {
  if (fieldSet === void 0 || fieldSet === null) return [def, enumPivotMode.COUNT];

  switch (typeof fieldSet) {
    case enumDataTypes.OBJ:
      let ents;

      if (Array.isArray(fieldSet) && (ents = [])) {
        vectorMapper.iterate(fieldSet, f => (f = parseFieldSet(f, def), matrix.isMatrix(f) ? mergeAcquire.acquire(ents, f) : ents.push(f)));
      } else {
        ents = Object.entries(fieldSet);
      }

      if (ents.length === 0) return [def, enumPivotMode.COUNT];
      if (ents.length === 1) return ents[0];
      return ents;

    case enumDataTypes.STR:
    case enumDataTypes.NUM:
      return [fieldSet, enumPivotMode.INCRE];

    default:
      return [def, enumPivotMode.COUNT];
  }
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

  toJson() {
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
exports.parseFieldSet = parseFieldSet;
