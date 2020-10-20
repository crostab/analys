import { ACCUM, AVERAGE, COUNT, FIRST, INCRE, LAST, MAX, MERGE, MIN } from '@analys/enum-pivot-mode'
import { Deco }                                                       from '@spare/deco'
import { logger, Xr }                                                 from '@spare/logger'
import { pair }                                                       from '@vect/object-init'
import { parseField }                                                 from '../src/parseField'

const FOO = 'foo', BAR = 'bar', KHA = 'kha', MIA = 'mia'
const candidates = {
  simpleCell: pair(BAR, COUNT),
  emptyArrayed: [],
  string: FOO,
  sparseArray: [FOO, null],
  stringArray: [FOO, KHA, MIA],
  oneRowed: [{ foo: INCRE }],
  fieldOnly: { foo: null },
  mixedObject: [{ foo: INCRE }, FOO, { kha: ACCUM }],
  mixedArray: [[FOO, ACCUM], KHA, [MIA, MERGE]],
  groupSpec: [
    ['maxt', MAX],
    ['maxt', MIN],
    ['maxt', FIRST],
    ['maxt', LAST],
    ['bypass', COUNT],
    ['dryw', AVERAGE],
    ['sku', ACCUM],
    ['app', MERGE],
  ]
}

const deco = Deco({ array: { vert: 1 } })

for (const [key, value] of Object.entries(candidates)) {
  // ({ key, value }) |> decoFlat |> logger
  Xr(key).parsed(parseField.call({ key: 'some', to: INCRE }, value) |> deco) |> logger
}

