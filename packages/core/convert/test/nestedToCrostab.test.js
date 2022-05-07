import { AVERAGE, FIRST }                    from '@analys/enum-pivot-mode'
import { round }                             from '@aryth/math'
import { decoCrostab }                       from '@spare/logger'
import { says }                              from '@spare/xr'
import { nestedToCrostab, nestedToListGram } from '../src/nestedToCrostab'

const PAIRS = {
  '@A1': { '@O2': '-32', '@S2': '-24', '@T2': '-80', '@U2': '-48', '@V2': '-72', '@l2': '-24' },
  '@B1': { '@A2': '-60', '@O2': '-12' },
  '@C1': { '@A2': '-48', '@l2': '-24', '@n2': '12', '@o2': '-24' },
  '@F1': { '@A2': '-48' },
  '@H1': { '@H2': '9', '@t2': '12' },
  '@L1': { '@O2': '-48', '@V2': '-60' },
  '@O1': { '@A2': '-80', '@T2': '-20', '@o2': '8', '@t2': '8' },
  '@P1': { '@A2': '-72', '@a2': '-24', '@o2': '-24' },
  '@R1': { '@a2': '-28' },
  '@T1': { '@A2': '-60', '@O2': '-24', '@l2': '-12', '@o2': '-36' },
  '@U1': { '@A2': '-54', '@l2': '-8' },
  '@V1': { '@A2': '-72', '@a2': '-48', '@o2': '-54' },
  '@c1': { '@a2': '-8', '@l2': '-18', '@o2': '-18' },
  '@i1': { '@n2': '12' },
  '@j1': { '@l2': '-8' },
  '@l1': { '@o2': '-12' },
  '@n1': { '@i2': '8', '@l2': '1', '@n2': '8', '@o2': '4', '@v2': '-12' },
  '@o1': { '@n2': '9', '@t2': '-12', '@v2': '-30', '@x2': '-36' },
  '@r1': { '@o2': '-12' },
  '@v1': { '@a2': '-18', '@o2': '-32', '@s2': '-12' },
}

nestedToCrostab(PAIRS, FIRST) |> decoCrostab |> says.raw
const UPPER = /(?<=^@*)([A-Z])(?=\d*$)/, LOWER = /(?<=^@*)([a-z])(?=\d*$)/

const trimKey = x => x.replace(/^@*/, '').replace(/\d*$/, '')

nestedToCrostab(PAIRS, FIRST,
  (x, y, v) => UPPER.test(x) && UPPER.test(y),
  (x, y, v) => [ trimKey(x), trimKey(y), v * 2 ]
) |> decoCrostab |> says.upper

nestedToCrostab(PAIRS, FIRST,
  (x, y, v) => LOWER.test(x) && LOWER.test(y),
  (x, y, v) => [ trimKey(x), trimKey(y), v * 2 ]
) |> decoCrostab |> says.lower

const verso = {
  A: 'A',
  B: 'O',
  C: 'O',
  F: 'V',
  H: 'H',
  L: 'A',
  O: 'O',
  P: 'O',
  T: 'V',
  U: 'V',
  V: 'V',
}
const recto = {
  O: 'O',
  S: 'O',
  T: 'V',
  U: 'V',
  V: 'V',
  A: 'A',
  H: 'H',
}

nestedToListGram(PAIRS,
  (x, y, v) => UPPER.test(x) && UPPER.test(y),
  (x, y, v) => [ verso[trimKey(x)] ?? x, recto[trimKey(y)] ?? y, v ]
) |> decoCrostab |> says.upper.br('grouped')

nestedToCrostab(PAIRS, AVERAGE,
  (x, y, v) => UPPER.test(x) && UPPER.test(y),
  (x, y, v) => [ verso[trimKey(x)] ?? x, recto[trimKey(y)] ?? y, +v ],
  list => round(list.average)
) |> decoCrostab |> says.upper.br('grouped')