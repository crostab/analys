import '@analys/table';
import { roundD2 } from '@aryth/math';
import { iterate } from '@vect/vector-mapper';
import { Roller } from '@vect/vector-roller';

const timeseriesRolling = function ({
  fields,
  depth = 4,
  mutate = true
}) {
  /** @type {Table} */
  const table = mutate ? this : this.copy();
  const indexes = table.columnIndexes(fields),
        indexCount = indexes.length;
  const rows = table.rows;

  for (const collection of Roller.build(rows, depth)) iterate(indexes, y => collection[0][y] = roundD2(columnSum(collection, y, depth)), indexCount);

  return rows.splice(-depth + 1), table.boot({
    rows
  });
};

const columnSum = (rows, y, h) => {
  h = h || rows.ht;
  let sum = 0;

  for (let i = 0; i < h; i++) sum += rows[i][y];

  return sum;
};

export { timeseriesRolling };
