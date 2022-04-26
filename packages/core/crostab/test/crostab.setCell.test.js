import { decoCrostab, logger } from '@spare/logger'
import { Crostab }             from '../src/Crostab'

const test = () => {
  const crostab = Crostab.from({
    side: [ '1', '2', '3' ],
    head: [ 'a', 'b', 'c' ]
  })
  crostab.setCell('3', 'c', 3)
  crostab.setCell('2', 'b', 2)
  crostab.setCell('4', 'a', 0)
  crostab.setCell('1', 'd', 0)
  crostab |> decoCrostab |> logger
}

test()