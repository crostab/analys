import { decoTable, logger } from '@spare/logger'
import { timeseriesRolling } from '../src/timeseriesRolling'
import { TableCollection }   from './assets/tableCollection'

const table = TableCollection.continued

timeseriesRolling.call(table, { fields: ['perf', 'quant'] }) |> decoTable |> logger
