import { TableCollection } from '@foba/table'
import { decoTable, says } from '@spare/logger'

let table = TableCollection.AeroEngineSpecs

table |> decoTable |> says[ROSTER + ' original']
