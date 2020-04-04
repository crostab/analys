'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var columnsMapper = require('@vect/columns-mapper');
var vectorType = require('@typen/vector-type');

const inferTypes = function ({
  inferType
} = {}) {
  const table = this;
  return columnsMapper.mapper(table.rows, vectorType.vectorType.bind(inferType));
};

exports.inferTypes = inferTypes;
