import { strategies }        from '@valjoux/strategies'
import { decoCrostab, says } from '@spare/logger'
import { iterate }           from '@vect/vector-mapper'

const { lapse, result } = strategies({
  repeat: 1E+7,
  candidates: {
    simple: [[1, 2, 3, null, 5, undefined, 7, 8, 9, 10]],
    another: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    misc: [],
  },
  methods: {
    bench: x => x,
    woutFilter: ve => {
      let hd = 0
      iterate(ve, x => hd += x ?? 0)
      return hd
    },
    withFilter: ve => {
      let hd = 0
      iterate(ve, x => { if (x) hd += x })
      return hd
    },
  }
})
lapse |> decoCrostab |> says['lapse']
result |> decoCrostab |> says['result']
