import { TableCollection }         from '@foba/table'
import { decoTable, logger, says } from '@spare/logger'
import { Table }                   from '../src/Table'

const table = TableCollection.AeroEngineSpecs |> Table.from

table |> decoTable |> logger

table.mutate(x => x / 1000, { fields: ['l', 'd', 'dryw'] }) |> decoTable |> says['mutated']

table.mutate(x => x / 1000, { exclusive: ['sku', 'plant', 'country', 'bypass', 'app'] }) |> decoTable |> says['mutated']
