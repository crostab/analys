'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumMutabilities = require('@analys/enum-mutabilities');

/**
 * @param {Object<str,function(*):boolean>} filterObject
 * @return {{includes:Table,excludes:Table}} - mutated 'this' {head, rows}
 */

const tableDivide = function ({
  includes,
  excludes
}) {
  /** @type {Table} */
  let body = this;

  if (includes && includes.length) {
    const [regenerated, body] = [body.spliceColumns(includes, enumMutabilities.IMMUTABLE), body.select(includes, enumMutabilities.MUTABLE)];
    return {
      includes: body,
      excludes: regenerated
    };
  }

  if (excludes && includes.length) {
    const [regenerated, body] = [body.select(excludes, enumMutabilities.IMMUTABLE), body.spliceColumns(excludes, enumMutabilities.MUTABLE)];
    return {
      includes: regenerated,
      excludes: body
    };
  }

  return {
    includes: body,
    excludes: body
  };
};

exports.tableDivide = tableDivide;
