import { COUNT, INCRE } from '@analys/enum-pivot-mode'
import { parseCell } from '../src/parseCell'
import { deco, logger, xr } from '@spare/logger'

const FOO = 'foo', BAR = 'bar', KHA = 'kha', MIA = 'mia'
const candidates = {
  simpleCell: { field: FOO, mode: COUNT },
  emptyArrayed: [],
  string: FOO,
  sparseArray: [FOO, null],
  stringArray: [FOO, KHA, MIA],
  oneRowed: [{ field: FOO, mode: INCRE }],
  fieldOnly: { field: FOO },
  modeOnly: { mode: COUNT },
}

for (const [key, value] of Object.entries(candidates)) {
  xr(key).parsed(parseCell(value, BAR) |> deco) |> logger
}

