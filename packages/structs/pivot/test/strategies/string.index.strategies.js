import { strategies }        from '@valjoux/strategies'
import { decoCrostab, says } from '@spare/logger'

const dataDev = {
  s: ['de', 'uk', 'fr'],
  b: ['uhi', 'hi', 'mhi', 'mlo', 'lo', 'ulo'],
  m: [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ],
}

const dataEdge = {
  de: { uhi: 0, hi: 0, mhi: 0, mlo: 0, lo: 0, ulo: 0, },
  uk: { uhi: 0, hi: 0, mhi: 0, mlo: 0, lo: 0, ulo: 0, },
  fr: { uhi: 0, hi: 0, mhi: 0, mlo: 0, lo: 0, ulo: 0, }
}

const { lapse, result } = strategies({
  repeat: 1E+7,
  candidates: {
    simple: ['uk', 'lo'],
    another: ['de', 'hi'],
    invalidX: ['jp', 'lo'],
    invalidY: ['uk', 'na']
  },
  methods: {
    critDev: (side, banner) => { return dataDev.s.indexOf(side) >= 0 && dataDev.b.indexOf(banner) >= 0 },
    bitDev: (side, banner) => {
      let x, y
      if ((x = dataDev.s.indexOf(side)) >= 0 && (y = dataDev.b.indexOf(banner)) >= 0) return dataDev.m[x][y]++
    },
    bitClassic: (side, banner) => {
      let row = dataDev.m[dataDev.s.indexOf(side)], y
      if (row && (y = dataDev.b.indexOf(banner) in row)) row[y]++
    },
    bitEdge: (side, banner) => { if (side in dataEdge && banner in dataEdge[side]) return dataEdge[side][banner]++ },
    critEdge: (side, banner) => (side in dataEdge && banner in dataEdge[side]),
    // dev: (x, y) => {
    //   const r = mDev[x]
    //   if (valid(r) && valid(r[y])) return r[y]++
    // },
    // edge: (x, y) => { if (x in mEpi && y in mEpi[x]) return mEdge[x][y] += 1 },

  }
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']
