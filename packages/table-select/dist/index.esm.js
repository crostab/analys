import { selectKeyedColumns } from '@analys/keyed-columns';
import { slice } from '@analys/table-init';

/**
 *
 * @param {TableObject} table
 * @param {(str|[str,str])[]} [fields]
 * @param {boolean=true} [mutate]
 * @returns {TableObject}
 */

const tableSelect = function (table, fields, {
  mutate = false
} = {}) {
  var _table;

  let o = mutate ? table : (_table = table, slice(_table));
  if (fields === null || fields === void 0 ? void 0 : fields.length) selectKeyedColumns.call(o, fields);
  return o;
};

export { tableSelect };
