import { Chips } from '@analys/chips';
import { Group } from '@analys/group';
import { tableFind } from '@analys/table-find';
import { slice } from '@analys/table-init';
import { parseField } from '@analys/tablespec';
import { isMatrix } from '@vect/matrix';
import { acquire } from '@vect/merge-acquire';

const tableGroup = function ({
  key,
  field,
  pick,
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
  let groupHead, label, mode;
  field = parseField(field, key);
  const groupingEngine = isMatrix(field) // field |> deco |> says['parsed field']
  ? (groupHead = acquire([key], field.map(([label]) => label)), new Group(head.indexOf(key), field.map(([label, mode]) => [head.indexOf(label), mode]), pick)) : ([label, mode] = field, groupHead = [key, label], new Chips(head.indexOf(key), head.indexOf(label), mode, pick));
  return {
    head: groupHead,
    rows: groupingEngine.record(rows).toRows()
  };
};

export { tableGroup };
