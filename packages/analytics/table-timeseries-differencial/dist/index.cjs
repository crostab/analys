'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var math = require('@aryth/math');
var numStrict = require('@typen/num-strict');
var vectorDifferentiator = require('@vect/vector-differentiator');
var vectorMapper = require('@vect/vector-mapper');

// import { Table }          from '@analys/util-table'
const timeseriesDifferential = function ({
  dateLabel = 'date',
  fields,
  mutate = true
}) {
  /** @type {Table} */
  const table = mutate ? this : this.copy();
  const dateIndex = table.coin(dateLabel);
  const indexes = table.columnIndexes(fields),
        depth = indexes.length;
  if (indexes.includes(dateIndex)) indexes.splice(indexes.indexOf(dateIndex), 1);
  const rows = table.rows;
  let pv, cv, prevNum, currNum;

  for (const [prev, curr] of vectorDifferentiator.Differentiator.build(rows)) if (equalYear(prev[dateIndex], curr[dateIndex])) {
    vectorMapper.iterate(indexes, i => {
      prevNum = numStrict.isNumeric(pv = prev[i]), currNum = numStrict.isNumeric(cv = curr[i]);

      if (prevNum) {
        if (currNum) {
          prev[i] = math.roundD2(pv - cv);
        } else {
          curr[i] = 0;
        }
      } else {
        if (currNum) {
          prev[i] = math.roundD2(0 - cv);
        } else {
          prev[i] = null;
        }
      }
    }, depth);
  }

  return rows.pop(), table.boot({
    rows
  });
};

const equalYear = (a, b) => a.slice(0, 4) === b.slice(0, 4);

exports.timeseriesDifferential = timeseriesDifferential;
