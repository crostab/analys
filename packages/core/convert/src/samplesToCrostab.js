import { CrosTab }                               from "@analys/crostab/src/CrosTab";
import { says }                                  from "@palett/says";
import { deco }                                  from "@spare/deco";
import { decoCrostab, DecoSamples, decoSamples } from "@spare/logger";
import { selectValues }                          from "@vect/object-select";
import { first }                                 from "@vect/vector-index";

export function samplesToCrostab(sampleCollection, sideFields, headFields) {
  const side = sideFields ?? Object.keys(sampleCollection)
  const objects = sideFields ? selectValues(sampleCollection, sideFields) : Object.values(sampleCollection)
  const rows = objects.map(headFields ? object => selectValues(object, headFields) : Object.values)
  const head = headFields ?? Object.keys(objects |> first)
  return CrosTab.from({ side, head, rows })
}

const test = () => {
  const samples = {
    china: { gdp_ppp: 29.47, gdp: 15.27, pop: 14.00, area: 9600 },
    usa: { gdp_ppp: 20.81, gdp: 20.81, pop: 3.28, area: 9834 },
    japan: { gdp_ppp: 5.45, gdp: 5.08, pop: 1.26, area: 378 },
    eu: { gdp_ppp: 20.72, gdp: 15.62, pop: 4.48, area: 4233 },
  }
  samples |> DecoSamples({ indexed: true }) |> says['samples']
  const crosTab = samplesToCrostab(samples, ['china', 'usa', 'japan'], ['gdp', 'pop'])
  crosTab |> decoCrostab |> says['crostab']


}

test()