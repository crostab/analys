import { says }                               from '@spare/logger'
import { decoCrostab, decoString, decoTable } from '@spare/logger'
import { camelToSnake }                       from '@spare/phrasing'
import { promises }                           from 'fs'
import { csvToCrostab, csvToTable }           from '../index'

const SRC = './packages/interop/csv/test/asset'

const testTable = async () => {
  const text = await promises.readFile(SRC + '/csv/simple.csv', 'utf-8')
  text  |> decoString  |> says['csvToTable' |> camelToSnake].br('text')
  const table = csvToTable(text)
  table |> decoTable |> says['csvToTable' |> camelToSnake].br('table')
}

const testCrostab = async () => {
  const text = await promises.readFile(SRC + '/csv/aoe.csv', 'utf-8')
  text  |> decoString  |> says['csvToCrostab' |> camelToSnake].br('text')
  const crostab = csvToCrostab(text)
  crostab |> decoCrostab |> says['csvToCrostab' |> camelToSnake].br('crostab')
}


testTable().then()
testCrostab().then()