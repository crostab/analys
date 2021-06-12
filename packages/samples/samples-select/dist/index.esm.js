import { mapper as mapper$1 } from '@vect/object-mapper';
import { mapper, iterate } from '@vect/vector-mapper';

/**
 *
 * @param {Object[]} samples
 * @param {(str|[str,str])[]} [fields]
 * @returns {null|{head:*[],rows:*[][]}}
 */

function samplesSelect(samples, fields) {
  if (fields != null && fields.length) {
    const assigners = mapper(fields, field => Array.isArray(field) ? assigner.bind({
      k: field[0],
      p: field[1]
    }) : assigner.bind({
      k: field
    }));
    return mapper(samples, sample => {
      let target = {};
      iterate(assigners, fn => fn(target, sample));
      return target;
    });
  }

  return mapper(samples, sample => mapper$1(sample, x => x));
}
const assigner = function (target, source) {
  target[this.p ?? this.k] = source[this.k];
};

export { samplesSelect };
