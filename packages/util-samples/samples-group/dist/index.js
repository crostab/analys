import { Chips } from '@analys/chips';
import { Group } from '@analys/group';
import { samplesFind } from '@analys/samples-find';
import { parseField } from '@analys/tablespec';
import { isMatrix } from '@vect/matrix';

const samplesGroup = function ({
  key,
  field,
  filter
} = {}) {
  let samples = this;
  if (filter) {samples = samplesFind.call(samples, filter); }
  const groupingEngine = isMatrix(field = parseField(field, key)) // field |> deco |> says['parsed field']
    ? new Group(key, field)
    : new Chips(key, field[0], field[1]);
  return groupingEngine.record(samples).toSamples()

};

export { samplesGroup };
