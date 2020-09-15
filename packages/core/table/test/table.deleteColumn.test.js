import { MUT }                                             from '@analys/enum-mutabilities'
import { Foba, TableCollection }                           from '@foba/table'
import { decoSamples, DecoTable, decoTable, logger, says } from '@spare/logger'
import { Table }                                           from '../src/Table'

{
  const table = TableCollection.AeroEngineSpecs |> Table.from

  table |> decoTable |> logger

  table.deleteColumn(['l', 'd', 'dryw', 'maxt', 'nonExist'], MUT) |> decoTable |> logger

  table.deleteColumn('app', MUT) |> decoTable |> logger
}

{
  const decoT = DecoTable({ top: 3, bottom: 2 })

  const US_TECH = 'USTechFirms'
  const table = Table.from(Foba[US_TECH])

  table |> decoT |> says.original

  table.deleteColumn(['companyName', 'price', 'mktCap'], { mutate: true }) |> decoT |> says.splice

  table.toSamples() |> decoSamples |> says['original samples']
}
