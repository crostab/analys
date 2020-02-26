'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const toKeyComparer = comparer => {
  return (a, b) => comparer(a[0], b[0]);
};

exports.toKeyComparer = toKeyComparer;
