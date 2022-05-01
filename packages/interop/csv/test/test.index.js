import { decoSamples, decoTable, DecoTable, decoVector, logger } from '@spare/logger'
import { promises }                                              from 'fs'
import ora          from 'ora'
import { NaiveCsv } from './candidates/NaiveCsv'

const spn = ora()
const SRC = 'packages/naivecsv/test/assets/csv/simple.csv'
spn.start(`start reading: ${SRC}`)
promises.readFile(SRC, 'utf-8').then(
  it => {
    spn.succeed(`done reading: ${SRC}`)
    // NaiveCsv.toRows(it, { popBlank: true }) |> console.log
    NaiveCsv.toTable(it)
      |> DecoTable({ read: x => x?.slice(0, 24), fullAngle: true })
      |> logger;
    ({ head: [], rows: [[]] }) |> decoTable |> logger
  }
)

promises
  .readFile(SRC)
  .then(text => {
    NaiveCsv.toRows(text, {
      de: ',',
      lf: '\r\n',
      qt: '\"',
      transpose: false,
      decode: 'utf-8',
      popBlank: true
    })
      |> decoSamples
      |> logger
  })

// const something = { a: { b: { c: { d: { e: { f: { g: { h: 1 } } } } } } } }
