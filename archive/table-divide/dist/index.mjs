import { divide as divide$1 } from '@vect/columns-select';
import { divide } from '@vect/vector-select';
import { mapper } from '@vect/vector-mapper';
import { slice }  from '@analys/table-init';

const NUM_ASC = (a, b) => a - b;

/**
 * Divide a util-table by fields
 * @param {*[]} fields
 * @return {{ pick:TableObject, rest:TableObject }} - mutated 'this' {head, rows}
 */

const tableDivide = function (fields) {
  var _this, _this2;

  /** @type {Table|TableObject} */
  const rs = (_this = this, slice(_this));
  /** @type {Table|TableObject} */

  const pk = (_this2 = this, slice(_this2));
  const {
    head,
    rows
  } = this;
  const indexes = mapper(fields, label => head.indexOf(label)).sort(NUM_ASC);
  ({
    pick: pk.head,
    rest: rs.head
  } = divide(head, indexes));
  ({
    pick: pk.rows,
    rest: rs.rows
  } = divide$1(rows, indexes));
  return {
    pick: pk,
    rest: rs
  };
};

export { tableDivide };
