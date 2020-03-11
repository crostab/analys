import { NUM, STR, OBJ } from '@typen/enums';
import { COUNT, INCRE } from '@analys/enum-pivot-mode';
import { mapper, iterate } from '@vect/vector-mapper';
import { NUM as NUM$1, STR as STR$1, OBJ as OBJ$1 } from '@typen/enum-data-types';
import { acquire } from '@vect/merge-acquire';

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

const isMatrix = mx => Array.isArray(mx) && Array.isArray(mx[0]);

/**
 *
 * @param {*} fieldSet
 * @param {str} def - default field
 * @returns {[str,number]|[str,number][]}
 */

const parseFieldSet = (fieldSet, def) => {
  if (fieldSet === void 0 || fieldSet === null) return [def, COUNT];

  switch (typeof fieldSet) {
    case OBJ$1:
      let ents;

      if (Array.isArray(fieldSet) && (ents = [])) {
        iterate(fieldSet, f => (f = parseFieldSet(f, def), isMatrix(f) ? acquire(ents, f) : ents.push(f)));
      } else {
        ents = Object.entries(fieldSet);
      }

      if (ents.length === 0) return [def, COUNT];
      if (ents.length === 1) return ents[0];
      return ents;

    case STR$1:
    case NUM$1:
      return [fieldSet, INCRE];

    default:
      return [def, COUNT];
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

export { TableSpec, parseCell, parseFieldSet };
