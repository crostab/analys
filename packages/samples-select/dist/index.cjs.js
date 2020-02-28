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
  if (!Array.isArray(fields)) return vectorMapper.mapper(samples, sample => objectMapper.mapper(sample, x => x));
  const assigners = vectorMapper.mapper(fields, toAssigner);
  return vectorMapper.mapper(samples, sample => {
    let target = {};
    return vectorMapper.iterate(assigners, assigner => {
      assigner(target, sample);
    }), target;
  });
}
const toAssigner = field => Array.isArray(field) ? assignProjectedField.bind({
  curr: field[0],
  proj: field[1]
}) : assignField.bind({
  field
});
const assignField = function (target, sample) {
  let {
    field
  } = this;
  target[field] = sample[field];
};
const assignProjectedField = function (target, sample) {
  let {
    proj,
    curr
  } = this;
  target[proj] = sample[curr];
};

exports.samplesSelect = samplesSelect;
