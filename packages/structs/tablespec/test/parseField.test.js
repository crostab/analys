import { ACCUM, COUNT, INCRE } from '@analys/enum-pivot-mode'
import { deco, logger, xr } from '@spare/logger'
import { pair }       from '@vect/object-init'
import { parseField } from '../src/parseField'

const FOO = 'foo', BAR = 'bar', KHA = 'kha', MIA = 'mia'
const candidates = {
  simpleCell: pair(BAR, COUNT),
  emptyArrayed: [],
  string: FOO,
  sparseArray: [FOO, null],
  stringArray: [FOO, KHA, MIA],
  oneRowed: [{ foo: INCRE }],
  fieldOnly: { foo: null },
  mixed: [{ foo: INCRE }, FOO, { kha: ACCUM }]
}

for (const [key, value] of Object.entries(candidates)) {
  xr(key).parsed(parseField(value, BAR) |> deco) |> logger
}

