import { NUM, STR, OBJ } from '@typen/enum-data-types';
import { COUNT, INCRE } from '@analys/enum-pivot-mode';
import { mapper } from '@vect/vector-mapper';
import { isNumStr } from '@typen/literal';
import { nullish } from '@typen/nullish';

const parseCell = (cell, defaultField) => {
  var _cell$field, _cell$mode;

  if (cell === void 0 || cell === null) return defaultCell(defaultField);

  switch (typeof cell) {
    case OBJ:
      if (Array.isArray(cell)) return cell.length ? mapper(cell, cell => parseCell(cell, defaultField)) : defaultCell(defaultField);
      cell.field = (_cell$field = cell.field) !== null && _cell$field !== void 0 ? _cell$field : defaultField;
      cell.mode = (_cell$mode = cell.mode) !== null && _cell$mode !== void 0 ? _cell$mode : COUNT;
      return cell;

    case STR:
    case NUM:
      return {
        field: cell,
        mode: INCRE
      };

    default:
      return defaultCell(defaultField);
  }
};

const defaultCell = defaultField => ({
  field: defaultField,
  mode: COUNT
});

/**
 * @typedef {string|number} str
 */

/**
 *
 * @param {str|str[]|Object<str,Function>|[string,Function][]} field
 * @param {number} level
 * @returns {{key:str,to:number}|{key:str,to:number}[]}
 */

function parseKey(field, level = 0) {
  const {
    key: defaultKey = '',
    to: defaultTo = null
  } = this !== null && this !== void 0 ? this : {};
  const fieldSets = [];
  if (nullish(field)) fieldSets.push({
    key: defaultKey,
    to: defaultTo
  });else if (isNumStr(field)) fieldSets.push({
    key: field,
    to: defaultTo
  });else if (Array.isArray(field)) {
    if (level > 0) fieldSets.push({
      key: field[0],
      to: field[1]
    });else for (let f of field) fieldSets.push(...parseField.call(this, f, level + 1));
  } else if (typeof field === OBJ) {
    for (let [key, to] of Object.entries(field)) fieldSets.push({
      key,
      to
    });
  }
  return fieldSets;
}
/**
 * @param key
 * @return {[*,*]}
 */

const parseKeyOnce = key => {
  if (nullish(key)) return [key];
  let t = typeof key;
  if (t === STR || t === NUM) return [key];
  if (t === OBJ) return Array.isArray(key) ? key : getEntryOnce(key);
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
 * @typedef {string|number} str
 */

/**
 *
 * @param {str|str[]|Object<str,Function>|[string,Function][]} field
 * @param {number} level
 * @returns {{key:str,to:number}|{key:str,to:number}[]}
 */

function parseField$1(field, level = 0) {
  const {
    key: defaultKey = '',
    to: defaultTo = null
  } = this !== null && this !== void 0 ? this : {};
  const fieldSets = [];
  if (nullish(field)) fieldSets.push({
    key: defaultKey,
    to: defaultTo
  });else if (isNumStr(field)) fieldSets.push({
    key: field,
    to: defaultTo
  });else if (Array.isArray(field)) {
    if (level > 0) fieldSets.push({
      key: field[0],
      to: field[1]
    });else for (let f of field) fieldSets.push(...parseField$1.call(this, f, level + 1));
  } else if (typeof field === OBJ) {
    for (let [key, to] of Object.entries(field)) fieldSets.push({
      key,
      to
    });
  }
  return fieldSets;
}

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

export { TableSpec, parseCell, parseField$1 as parseField, parseKey, parseKeyOnce };
