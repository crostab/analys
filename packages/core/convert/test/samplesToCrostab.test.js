import { says }                     from "@spare/logger"
import { decoCrostab, DecoSamples } from "@spare/logger"
import { samplesToCrostab }         from "../src/samplesToCrostab"

const test = () => {
  const samples = {
    china: { gdp_ppp: 29.47, gdp: 15.27, pop: 14.00, area: 9600 },
    usa: { gdp_ppp: 20.81, gdp: 20.81, pop: 3.28, area: 9834 },
    japan: { gdp_ppp: 5.45, gdp: 5.08, pop: 1.26, area: 378 },
    eu: { gdp_ppp: 20.72, gdp: 15.62, pop: 4.48, area: 4233 },
  }
  samples |> DecoSamples({ indexed: true }) |> says['samples']
  const crosTab = samplesToCrostab(samples, {
    side: ['china', 'usa', 'japan'],
    head: ['gdp', 'pop']
  })
  crosTab |> decoCrostab |> says['crostab']
}

test()