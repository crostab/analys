import { Chips } from '@analys/chips';
import { Group } from '@analys/group';
import { tableFind } from '@analys/table-find';
import { slice } from '@analys/table-init';
import { parseField } from '@analys/tablespec';
import { acquire } from '@vect/vector-algebra';

const tableGroup = function ({
  key,
  field,
  filter,
  alias
} = {}) {
  const table = slice(this);

  if (filter) {
    tableFind.call(table, filter);
  }

  const {
    head,
    rows
  } = table;
  let groupHead, label, to, mode;
  [{
    key,
    to
  }] = parseField(key);
  const groupingEngine = (field = parseField.call({
    key
  }, field)).length > 1 // field |> deco |> says['parsed field']
  ? (groupHead = acquire([key], field.map(({
    key: label
  }) => label)), new Group([head.indexOf(key), to], field.map(({
    key: label,
    to: mode
  }) => [head.indexOf(label), mode]))) : ([{
    key: label,
    to: mode
  }] = field, groupHead = [key, label], new Chips([head.indexOf(key), to], [head.indexOf(label), mode]));
  if (alias) for (let [field, proj] of Array.isArray(alias) ? alias : Object.entries(alias)) {
    const i = groupHead.indexOf(field);
    if (i > 0) groupHead[i] = proj;
  }
  return {
    head: groupHead,
    rows: groupingEngine.record(rows).toRows()
  };
};

export { tableGroup };
