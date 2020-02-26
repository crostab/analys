import { Foba } from '@foba/crostab'
import { decoCrostab, says } from '@spare/logger'
import { CrosTab } from '../src/CrosTab'

const TITLE = 'ArmsExports'

let crostab = CrosTab.from(Foba[TITLE])
crostab |> decoCrostab |> says[TITLE + ' original']

crostab.size |> says.size
crostab.ht |> says.ht
crostab.wd |> says.wd


