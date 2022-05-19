'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vectorType = require('@typen/vector-type');
var columnsMapper = require('@vect/columns-mapper');

const inferTypes = function (options = {}) {
  return columnsMapper.columnsMapper(this === null || this === void 0 ? void 0 : this.rows, vectorType.vectorType.bind(options));
};

exports.inferTypes = inferTypes;
