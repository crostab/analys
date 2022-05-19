import { SimpleVectors } from '@foba/foo'
import { deco, logger, says, xr } from '@spare/logger'
import { selectKeyedVector }      from '../utils/selectKeyedVector'

const arrays = SimpleVectors
for (const [key, array] of Object.entries(arrays)) {
  key |> logger
  array |>  deco |> says['original']
  const { select, splice } = selectKeyedVector(array, [3])
  xr().select(select).splice(splice) |> says['select splice']
  array |> deco |> says['original']
  '' |> logger
}
