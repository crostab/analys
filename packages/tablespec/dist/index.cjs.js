'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enums = require('@typen/enums');
var enumPivotMode = require('@analys/enum-pivot-mode');
var vectorMapper = require('@vect/vector-mapper');

const parseCell = (cell, defaultField) => {
  if (cell === void 0 || cell === null) return defaultCell(defaultField);

  switch (typeof cell) {
    case enums.OBJ:
      if (Array.isArray(cell)) return cell.length ? vectorMapper.mapper(cell, cell => parseCell(cell, defaultField)) : defaultCell(defaultField);
      if (!cell.field) cell.field = defaultField;
      if (!cell.mode) cell.mode = enumPivotMode.COUNT;
      return cell;

    case enums.STR:
    case enums.NUM:
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

exports.parseCell = parseCell;
