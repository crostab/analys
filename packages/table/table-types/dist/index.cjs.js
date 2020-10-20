'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var columnsMapper = require('@vect/columns-mapper');
var vectorType = require('@typen/vector-type');

const inferTypes = function ({
  inferType,
  omitNull = true
} = {}) {
  const table = this;
  return columnsMapper.mapper(table.rows, vectorType.VectorType({
    inferType,
    omitNull
  }));
};

exports.inferTypes = inferTypes;
