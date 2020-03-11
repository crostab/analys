import { Pivot } from '@analys/pivot';
import { Cubic } from '@analys/cubic';
import { CrosTab } from '@analys/crostab';
import { parseCell } from '@analys/tablespec';
import { samplesFilter } from '@analys/samples-filter';
import { mapper } from '@vect/vector-mapper';

/**
 *
 * @param {Object[]} samples
 * @param {str} side
 * @param {str} banner
 * @param {CubeCell[]|CubeCell} [cell]
 * @param {Filter[]|Filter} [filter]
 * @param {Filter[]|Filter} [filter]
 * @param {function():number} formula - formula is valid only when cell is CubeCell array.
 * @returns {CrosTab}
 */

const samplesPivot = (samples, {
  side,
  banner,
  cell,
  filter,
  formula
}) => {
  if (filter) {
    samples = samplesFilter.call(samples, filter);
  }

  let calc;
  const pivot = Array.isArray(cell = parseCell(cell, side)) ? (calc = true, Cubic.build(side, banner, (mapper(cell, appendIndex), cell))) : (calc = false, Pivot.build(side, banner, cell.field, cell.mode));
  const crostab = CrosTab.from(pivot.spread(samples).toJson());
  if (calc && formula) crostab.map(ar => formula.apply(null, ar));
  return crostab;
};

const appendIndex = function (cell) {
  cell.index = cell.field;
};

export { samplesPivot };
