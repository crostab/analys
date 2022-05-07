import { decoCrostab } from '@spare/logger'
import { indexed }     from '@vect/nested'
import { DataGram }    from '../src/DataGram'

const nested = {
  0: { a: 1, b: 1 },
  1: { b: 1, c: 1 },
  2: {},
  3: { e: 1 },
  4: { d: 1, a: 1 },
}

const dataGram = DataGram.build('')
for (let [ x, y, v ] of indexed(nested)) {
  dataGram.update(x, y, v)
}

dataGram |> decoCrostab |> console.log

