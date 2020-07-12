import { INCRE }                                              from '@analys/enum-pivot-mode'
import { matchSlice }                                         from '@analys/table-init'
import { STR_DESC }                                           from '@aryth/comparer'
import { deca, delogger }                                     from '@spare/deco'
import { DecoCrostab, DecoTable, DecoVector, logger, logNeL } from '@spare/logger'
import { isNumeric }                                          from '@typen/num-strict'
import { ROWWISE }                                            from '@vect/matrix'
import { promises }                                           from 'fs'
import { NaiveCsv }                                           from 'naivecsv'
import ora                                                    from 'ora'
import { Table }                                              from '../src/Table'

const spn = ora()
const WORKSPACE = './packages/core/table/'
const SOURCE = WORKSPACE + 'test/assets/big-mac-source-data.csv'
const TARGET_TABLE = WORKSPACE + 'test/assets/out/BigMacIndex.Table.json'
const TARGET_SAMPLES = WORKSPACE + 'test/assets/out/BigMacIndex.Samples.json'
const TARGET_CROSTAB = WORKSPACE + 'test/assets/out/BigMacIndex.CrosTab.json'

spn.start(`start reading: ${ SOURCE }`)
promises
  .readFile(SOURCE, 'utf-8')
  .then(it => {
    spn.succeed(`done reading: ${ SOURCE }`)
    return NaiveCsv.toTable(it, { popBlank: true }) |> matchSlice
  })
  .then(async table => {
    const head = ['date', ['iso_a3', 'region'], ['dollar_price', 'price'], ['GDP_dollar', 'gdppc'], 'name', ['currency_code', 'cur']]
    table = Table.from(table)
    table
      .filter({ field: 'date', filter: x => !x.endsWith('01-01') })
      .select(head, { mutate: true })
      .mutateColumn('date', x => x
        .replace(/[0-9]+/g, x => x.padStart(2, '0'))
        .replace(/\//g, '-'))
      .mutateColumn('price', x => isNumeric(x) ? +x : NaN)
      .mutateColumn('gdppc', x => isNumeric(x) ? +x : NaN)
      .sort('date', STR_DESC, { mutate: true })
    table.inferTypes() |> delogger
    table |> DecoTable({ top: 8, bottom: 4 })|> logNeL
    await promises.writeFile(TARGET_TABLE, JSON.stringify(table))
    const samples = table.toSamples()
    samples |> DecoVector({ head: 1, tail: 1, abstract: deca({ al: 128 }) }) |> logNeL
    await promises.writeFile(TARGET_SAMPLES, JSON.stringify(samples))
    return table
  })
  .then(table => {
    const countryList = ['USA', 'CHN', 'EUZ', 'GBR', 'RUS', 'JPN', 'KOR', 'HKG', 'SGP', 'TWN', 'BRA']
    const DATE = 'date', REGION = 'region', PRICE = 'price'
    const spec = {
      side: DATE,
      banner: REGION,
      cell: { field: PRICE, mode: INCRE },
      filter: [
        { field: REGION, filter: x => countryList.includes(x) },
        { field: PRICE, filter: isNumeric }
      ]
    }
    const crosTab = Table.from(table).crosTab(spec)
    crosTab
      .map(x => (+x).toFixed(2), { mutate: true })
      .sortByLabels({ direct: ROWWISE, comparer: STR_DESC, mutate: true })
    return crosTab
  })
  .then(async crosTab => {
    crosTab |> DecoCrostab({ top: 5, bottom: 3, left: 5, right: 5 }) |> logger
    await promises.writeFile(TARGET_CROSTAB, JSON.stringify(crosTab))
  })

