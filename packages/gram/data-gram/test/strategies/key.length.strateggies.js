import { makeEmbedded }              from '@foba/util'
import { decoCrostab, logger, says } from '@spare/logger'
import { strategies }                from '@valjoux/strategies'
import { dateTime }                  from '@valjoux/timestamp-pretty'

const test = () => {
  const { lapse, result } = strategies({
    repeat: 3E+7,
    candidates: {
      alpha: { s: [], b: [], m: [] },
      beta: { side: [], banner: [], matrix: [] },
      gamma: { queryRow: () => {}, queryColumn: () => {}, storage: [], side: [], banner: [], matrix: [] },
      delta: { queryRow: () => {}, queryColumn: () => {}, storage: [], data: { side: [], banner: [], matrix: [] } },
    } |> makeEmbedded,
    methods: {
      arch: x => {return x?.m},
      dev: x => {return x?.matrix},
      edge: x => {return x?.data?.matrix},
    }
  })
  lapse |> decoCrostab |> says['lapse'].p(dateTime())
  '' |> logger
  result |> decoCrostab |> says['result'].p(dateTime())
}
test()