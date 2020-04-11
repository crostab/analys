import { Cubic }       from '@analys/cubic'
import { Pivot }       from '@analys/pivot'
import { samplesFind } from '@analys/samples-find'
import { parseField }             from '@analys/tablespec'
import { mutate as mutateMatrix } from '@vect/matrix-mapper'

/**
 *
 * @param {Object[]} samples
 * @param {str} side
 * @param {str} banner
 * @param {*} [field]
 * @param {Object<string,function(?*):boolean>} [filter]
 * @param {Function} formula - formula is valid only when cell is CubeCell array.
 * @returns {Object}
 */
export const samplesPivot = function ({
  side,
  banner,
  field,
  filter,
  formula
}) {
  let samples = this
  if (filter) { samples = samplesFind.call(samples, filter) }
  let cubic
  const crostabEngine = Array.isArray(field = parseField(field, side))
    ? (cubic = true, new Cubic(side, banner, field))
    : (cubic = false, new Pivot(side, banner, field[0], field[1]))
  const crostab = crostabEngine.record(samples).toObject()
  if (cubic && formula) mutateMatrix(crostab.rows, vec => formula.apply(null, vec))
  return crostab
}

