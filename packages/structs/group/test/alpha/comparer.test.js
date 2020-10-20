import { max, min } from '@aryth/comparer'
import { says }     from '@spare/logger'

const candidates = [
  NaN,
  null,
  Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY
]

const bench = 0

for (let candidate of candidates) {
  max(candidate, bench) |> says['max test'].br(candidate)
}

for (let candidate of candidates) {
  min(candidate, bench) |> says['min test'].br(candidate)
}
