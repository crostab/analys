import { deco }     from '@spare/deco'
import { says }     from '@spare/logger'
import { argnames } from '../../utils/argnames'

const candidates = {
  averageAlpha: ({ total, count }) => total / count,
  averageBeta ({ total, count }) { return total / count },
  averageGamma: (o) => o.total / o.count,
  averageDelta (o) { return o.total / o.count },
  averageTheta1: (total, count) => { return total / count },
  averageTheta2: function (total, count) { return total / count },
  averageTheta3: function theta (total, count) { return total / count },
  averageTheta4 (total, count) { return total / count },
  averageOmeta4 () { return this.total / this.count },
}

for (const [key, func] of Object.entries(candidates)) {
  argnames(func) |> deco |> says[key]
}
