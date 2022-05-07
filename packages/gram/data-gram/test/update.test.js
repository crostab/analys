import { randBetw }   from '@aryth/rand'
import { decoVector } from '@spare/logger'

const o = {
  get val() {return randBetw(0, 10)}
}

o.val |> console.log
o.val |> console.log
Array(5).fill(o.val) |> console.log

function collect(key, hi) {
  const vec = Array(hi)
  for (let i = 0; i < hi; i++) vec[i] = this[key]
  return vec
}

collect.call(o, 'val', 5) |> decoVector |> console.log
