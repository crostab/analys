import { TableCollection } from '@foba/table'
import { delogger }        from '@spare/deco'
import { decoTable, says } from '@spare/logger'
import { Table }           from '../src/Table'

let table = TableCollection.AeroEngineSpecs |> Table.from

table |> decoTable |> says['original']

table.row('plant', 'PW', true)|> delogger
