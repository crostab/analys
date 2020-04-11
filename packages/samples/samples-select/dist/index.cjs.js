'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var objectMapper = require('@vect/object-mapper');
var vectorMapper = require('@vect/vector-mapper');

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {null|{head:*[],rows:*[][]}}
 */

function samplesSelect(samples, fields) {
  if (fields === null || fields === void 0 ? void 0 : fields.length) {
    const assigners = vectorMapper.mapper(fields, field => Array.isArray(field) ? assigner.bind({
      k: field[0],
      p: field[1]
    }) : assigner.bind({
      k: field
    }));
    return vectorMapper.mapper(samples, sample => {
      let target = {};
      vectorMapper.iterate(assigners, fn => fn(target, sample));
      return target;
    });
  }

  return vectorMapper.mapper(samples, sample => objectMapper.mapper(sample, x => x));
}
const assigner = function (target, source) {
  var _this$p;

  target[(_this$p = this.p) !== null && _this$p !== void 0 ? _this$p : this.k] = source[this.k];
};

exports.samplesSelect = samplesSelect;
