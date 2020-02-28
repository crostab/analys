import { mapper as mapper$1 } from '@vect/object-mapper';
import { mapper, iterate } from '@vect/vector-mapper';

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {null|{head:*[],rows:*[][]}}
 */

function samplesSelect(samples, fields) {
  if (!Array.isArray(fields)) return mapper(samples, sample => mapper$1(sample, x => x));
  const assigners = mapper(fields, toAssigner);
  return mapper(samples, sample => {
    let target = {};
    return iterate(assigners, assigner => {
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

export { samplesSelect };
