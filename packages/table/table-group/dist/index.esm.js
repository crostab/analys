import { tableFind } from '@analys/table-find';
import { slice } from '@analys/table-init';
import { parseField } from '@analys/tablespec';
import { Group } from '@analys/group';
import { Chips } from '@analys/chips';
import { Table } from '@analys/table';
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
  let groupHead;
  field = parseField(field, key);
  const groupingEngine = isMatrix(field) // field |> deco |> says['parsed field']
  ? (groupHead = acquire([key], field.map(entry => entry[0])), new Group(head.indexOf(key), field.map(([key, mode]) => [head.indexOf(key), mode]))) : (groupHead = [key, field[0]], new Chips(head.indexOf(key), head.indexOf(field[0]), field[1]));
  return new Table(groupHead, groupingEngine.record(rows).toRows());
};

export { tableGroup };
