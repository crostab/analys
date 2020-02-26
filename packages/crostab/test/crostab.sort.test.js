import { Foba } from '@foba/crostab'
import { DecoCrostab, decoCrostab, says } from '@spare/logger'
import { CrosTab } from '../src/CrosTab'
import { COLUMNWISE, ROWWISE } from '@vect/matrix'
import { NUM_ASC, NUM_DESC, STR_DESC } from '@aryth/comparer'

const decoX = DecoCrostab({ top: 5, bottom: 2 })
const TITLE = 'ArmsExports'

let crostab = CrosTab.from(Foba[TITLE])
crostab |> decoX |> says[TITLE + ' original']

crostab.sort({ direct: ROWWISE, field: 'EUU', comparer: NUM_DESC })
  |> decoX
  |> says[TITLE + ' sorted rowwise by EUU, descending']

crostab.sort({ direct: COLUMNWISE, field: '2018', comparer: NUM_DESC })
  |> decoX
  |> says[TITLE + ' sorted columnwise by 2018, descending']

crostab.sortByLabels({ direct: ROWWISE, comparer: NUM_ASC })
  |> decoX
  |> says[TITLE + ' sorted rowwise by side, ascending']

crostab.sortByLabels({ direct: COLUMNWISE, comparer: STR_DESC, mutate: false })
  |> decoX
  |> says[TITLE + ' sorted columnwise by banner, descending']

crostab |> decoX |> says[TITLE + ' original']


