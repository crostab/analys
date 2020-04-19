'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');
var enumPivotMode = require('@analys/enum-pivot-mode');
var vectorMapper = require('@vect/vector-mapper');
var nullish = require('@typen/nullish');
var vectorMerge = require('@vect/vector-merge');

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

const parseKey = key => {
  if (nullish.nullish(key)) return [key];
  let t = typeof key;
  if (t === enumDataTypes.STR || t === enumDataTypes.NUM) return [key];
  if (t === enumDataTypes.OBJ) return Array.isArray(key) ? key : Object.entries(key);
  return key;
};
/**
 * @param key
 * @return {[*,*]}
 */

const parseKeyOnce = key => {
  if (nullish.nullish(key)) return [key];
  let t = typeof key;
  if (t === enumDataTypes.STR || t === enumDataTypes.NUM) return [key];
  if (t === enumDataTypes.OBJ) return Array.isArray(key) ? key : getEntryOnce(key);
  return [key];
};
/**
 *
 * @param {Object} o
 * @return {*}
 */

const getEntryOnce = o => {
  for (let k in o) return [k, o[k]];
};

/**
 *
 * @param {*} field
 * @param {str} neglect - default field
 * @returns {[str,number]|[str,number][]}
 */

const parseField = (field, neglect) => {
  let t = typeof field,
      ents;
  if (nullish.nullish(field)) return [neglect, enumPivotMode.COUNT];

  if (t === enumDataTypes.OBJ) {
    ents = Array.isArray(field) ? parseFields(field, neglect) : Object.entries(field);
    if (ents.length === 0) return [neglect, enumPivotMode.COUNT];
    if (ents.length === 1) return ents[0];
    return ents;
  }

  if (t === enumDataTypes.STR || t === enumDataTypes.NUM) return [field, enumPivotMode.INCRE];
  return [neglect, enumPivotMode.COUNT];
};
const parseFields = (fields, neglect) => {
  let ents = [],
      t;

  for (let field of fields) if (nullish.nullish(field)) {
    ents.push([neglect, enumPivotMode.COUNT]);
  } else if (Array.isArray(field)) {
    ents.push(field);
  } else if ((t = typeof field) && (t === enumDataTypes.STR || t === enumDataTypes.NUM)) {
    ents.push([field, enumPivotMode.INCRE]);
  } else if (t === enumDataTypes.OBJ) {
    vectorMerge.acquire(ents, Object.entries(field));
  } else {
    ents.push([neglect, enumPivotMode.COUNT]);
  }

  return ents;
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
exports.parseKey = parseKey;
exports.parseKeyOnce = parseKeyOnce;
