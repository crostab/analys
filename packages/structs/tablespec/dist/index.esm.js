import { NUM, STR, OBJ } from '@typen/enum-data-types';
import { COUNT, INCRE } from '@analys/enum-pivot-mode';
import { mapper } from '@vect/vector-mapper';
import { acquire } from '@vect/merge-acquire';
import { isMatrix } from '@vect/matrix';

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
 *
 * @param {*} field
 * @param {str} neglect - default field
 * @returns {[str,number]|[str,number][]}
 */

const parseField = (field, neglect) => {
  if (field === void 0 || field === null) return [neglect, COUNT];
  let t = typeof field,
      ents;

  if (t === OBJ) {
    if (Array.isArray(field) && (ents = [])) {
      field.map(subField => parseField(subField, neglect)).forEach(subField => isMatrix(subField) ? acquire(ents, subField) : ents.push(subField));
    } else {
      ents = Object.entries(field);
    }

    if (ents.length === 0) return [neglect, COUNT];
    if (ents.length === 1) return ents[0];
    return ents;
  }

  if (t === STR || t === NUM) return [field, INCRE];
  return [neglect, COUNT];
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

export { TableSpec, parseCell, parseField };
