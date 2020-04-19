import { NUM, STR, OBJ } from '@typen/enum-data-types';
import { COUNT, INCRE } from '@analys/enum-pivot-mode';
import { mapper } from '@vect/vector-mapper';
import { nullish } from '@typen/nullish';
import { acquire } from '@vect/vector-merge';

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

const parseKey = key => {
  if (nullish(key)) return [key];
  let t = typeof key;
  if (t === STR || t === NUM) return [key];
  if (t === OBJ) return Array.isArray(key) ? key : Object.entries(key);
  return key;
};
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
 *
 * @param {*} field
 * @param {str} neglect - default field
 * @returns {[str,number]|[str,number][]}
 */

const parseField = (field, neglect) => {
  let t = typeof field,
      ents;
  if (nullish(field)) return [neglect, COUNT];

  if (t === OBJ) {
    ents = Array.isArray(field) ? parseFields(field, neglect) : Object.entries(field);
    if (ents.length === 0) return [neglect, COUNT];
    if (ents.length === 1) return ents[0];
    return ents;
  }

  if (t === STR || t === NUM) return [field, INCRE];
  return [neglect, COUNT];
};
const parseFields = (fields, neglect) => {
  let ents = [],
      t;

  for (let field of fields) if (nullish(field)) {
    ents.push([neglect, COUNT]);
  } else if (Array.isArray(field)) {
    ents.push(field);
  } else if ((t = typeof field) && (t === STR || t === NUM)) {
    ents.push([field, INCRE]);
  } else if (t === OBJ) {
    acquire(ents, Object.entries(field));
  } else {
    ents.push([neglect, COUNT]);
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

export { TableSpec, parseCell, parseField, parseKey, parseKeyOnce };
