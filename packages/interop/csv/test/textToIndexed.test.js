import { decoFlat, logger } from '@spare/logger'
import { promises } from 'fs'
import { indexed }  from '../src/indexed'

const SRC = './packages/interop/csv/test/asset'

const test = async () => {
  const text =await promises.readFile(SRC + '/csv/aoe.csv', 'utf-8')
  for (let row of indexed(text)) {
    row  |> decoFlat  |> logger
  }
}

test()