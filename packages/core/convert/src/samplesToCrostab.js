import { CrosTab }                    from "@analys/crostab"
import { selectValues, SelectValues } from "@vect/object-select"
import { first }                      from "@vect/vector-index"

/**
 *
 * @param sampleCollection
 * @param {Object} config
 * @param {[]} config.side
 * @param {[]} config.head
 * @returns {CrosTab}
 */
export function samplesToCrostab(sampleCollection, config = {}) {
  const samples = config.side ? selectValues(sampleCollection, config.side) : Object.values(sampleCollection)
  const side = config.side ?? Object.keys(sampleCollection)
  const head = config.head ?? Object.keys(samples |> first)
  const rows = samples.map(config.head ? SelectValues(config.head) : Object.values)
  return CrosTab.from({ side, head, rows })
}
