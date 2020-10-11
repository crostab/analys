import { Foba }                from '@foba/crostab'
import { decoCrostab, logNeL } from '@spare/logger'
import { crostabShuffle }      from '../src/crostabShuffle'

const crostab = Foba['Gdp']

crostab |> decoCrostab |> logNeL

crostabShuffle(crostab, {}) |> decoCrostab |> logNeL

crostab |> decoCrostab |> logNeL


