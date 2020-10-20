import { DIFFERENCE, ROLLING } from '@analys/enum-difference-modes';
import { timeseriesDifferential } from '@analys/table-timeseries-differential';
import { timeseriesRolling } from '@analys/table-timeseries-rolling';
import { NUM } from '@typen/enum-data-types';

const differential = function ({
  mode = DIFFERENCE,
  dateLabel = 'date',
  fields,
  depth = 4,
  mutate = true
}) {
  /** @type {Table} */
  let table = this;

  if (typeof mode === NUM) {
    if (mode === DIFFERENCE) return timeseriesDifferential.call(table, {
      dateLabel,
      fields,
      mutate
    });
    if (mode === ROLLING) return timeseriesRolling.call(table, {
      dateLabel,
      fields,
      depth,
      mutate
    });
  }

  if (Array.isArray(mode)) {
    if (mode.includes(DIFFERENCE)) table = timeseriesDifferential.call(table, {
      dateLabel,
      fields,
      mutate
    });
    if (mode.includes(ROLLING)) table = timeseriesRolling.call(table, {
      dateLabel,
      fields,
      depth,
      mutate
    });
  }

  return table;
};

export { differential };
