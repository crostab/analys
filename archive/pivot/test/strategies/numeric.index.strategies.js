import { strategies }        from '@valjoux/strategies'
import { decoCrostab, says } from '@spare/logger'
import { init, range }       from '@vect/vector-init'

const data = {
  s: ['de', 'uk', 'fr'],
  b: ['00', '10', '20'],
  m: [],
}

const mEpi = init(16, () => range(0, 63))
const mDev = init(16, () => range(0, 63))
const mEdge = init(16, () => range(0, 63))
const mFut = init(16, () => range(0, 63))
const mOmni = init(16, () => range(0, 63))
const valid = (x) => x !== null && x !== void 0
const dustbin = []
let dustnum = 0
const { lapse, result } = strategies({
  repeat: 1E+7,
  candidates: {
    simple: [8, 32],
    another: [15, 48],
    invalidX: [-1, 32],
    invalidY: [15, -1]
  },
  methods: {
    bench: (x, y) => (x in mEpi && y in mEpi[x]),
    epi: (x, y) => { if (x in mEpi && y in mEpi[x]) return mFut[x][y]++ },
    dev: (x, y) => {
      const r = mDev[x]
      if (valid(r) && valid(r[y])) return r[y]++
    },
    edge: (x, y) => { if (x in mEpi && y in mEpi[x]) return mEdge[x][y] += 1 },
    fut: (x, y) => { if (x in mEpi && y in mEpi[x]) return mDev[x][y] = mDev[x][y] + 1 },
    omni: (x, y) => { ((mOmni[x] ?? dustbin)[y])++ },
    crit: (x, y) => {
      let r
      return valid(r = mEpi[x]) ? valid(r[y]) : false
    }
  }
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']
