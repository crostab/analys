import BigMacTable from './assets/out/BigMacIndex.Table'
import { Table } from '../src/Table'
import { COUNT, INCRE } from '@analys/enum-pivot-mode'
import { CrosTab } from '@analys/crostab'
import { decoCrostab, DecoTable, logger } from '@spare/logger'
import { delogger } from '@spare/deco'

const table = Table.from(BigMacTable)

const DATE = 'date', REGION = 'region', ERA = 'era'
const regions = [
  'CHN',
  'USA',
  'EUZ',
  'RUS',
  'JPN',
  'GBR',
  'HKG',
  'KOR',
  'SGP',
  'BRA',
  'TWN'
]

const yearEra = year => ~~(year / 5) * 5

table.pushColumn(ERA,
  table.column(DATE).map(dashed => +(dashed.slice(0, 4)) |> yearEra)
)

table |> DecoTable({ top: 5, bottom: 2 }) |> delogger

const crosTab = table.crosTab({
  side: ERA,
  banner: REGION,
  field: {
    price: INCRE,
    era: COUNT
  },
  filter: {
    region: x => regions.includes(x),
    date: x => x.slice(-5) !== '01-01'
  },
  formula: (p, c) => (p / c).toFixed(2)
}) |> CrosTab.from

crosTab |> decoCrostab |> logger


