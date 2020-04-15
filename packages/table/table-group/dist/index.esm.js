import { Chips } from '@analys/chips';
import { Group } from '@analys/group';
import { tableFind } from '@analys/table-find';
import { slice } from '@analys/table-init';
import { parseKeyOnce, parseField } from '@analys/tablespec';
import { isMatrix } from '@vect/matrix';
import { acquire } from '@vect/merge-acquire';

const tableGroup = function ({
  key,
  field,
  filter
} = {}) {
  const table = slice(this);

  if (filter) {
    tableFind.call(table, filter);
  }

  const {
    head,
    rows
  } = table;
  let groupHead, label, pick, mode;
  [key, pick] = parseKeyOnce(key);
  const groupingEngine = isMatrix(field = parseField(field, key)) // field |> deco |> says['parsed field']
  ? (groupHead = acquire([key], field.map(([label]) => label)), new Group([head.indexOf(key), pick], field.map(([label, mode]) => [head.indexOf(label), mode]))) : ([label, mode] = field, groupHead = [key, label], new Chips([head.indexOf(key), pick], [head.indexOf(label), mode]));
  return {
    head: groupHead,
    rows: groupingEngine.record(rows).toRows()
  };
};

export { tableGroup };
