import { TableCollection }                      from '@foba/table'
import { deco }                                 from '@spare/deco'
import { LF }                                   from '@spare/enum-chars'
import { DecoEntries, decoTable, logger, says } from '@spare/logger'
import { camelToSnake }                         from '@spare/phrasing'
import { xr }                                   from '@spare/xr'
import { Table }                                from '../src/Table'

const TITLE = 'AeroEngineSpecs' |> camelToSnake
const table = TableCollection.AeroEngineSpecs |> Table.from

table
  // |> DecoTable({ top: 3, bottom: 2 })
  |> decoTable
  |> says['table ' + TITLE]

'' |> logger

const KEY_FIELD = 'sku', VALUE_FIELD = 'app'
const dict = table.lookupTable(KEY_FIELD, VALUE_FIELD)

Object.entries(dict) |> DecoEntries({ head: 3, tail: 2 }) |> says[TITLE + ' lookup table']

'' |> logger

const valueToFind = 'EJ200'
xr('lookup once').p(LF)
  ['value to find'](valueToFind).p(LF)
  ['keyIndex field'](KEY_FIELD)['value field'](VALUE_FIELD).p(LF)
  ['result'](table.lookupOne('EJ200', KEY_FIELD, VALUE_FIELD, true))
  |> says['table ' + TITLE]

'' |> logger

const valuesToFind = [ 'EJ200', 'F100-PW-229', 'F110', 'WS-13' ]
xr('lookup once').p(LF)
  ['values to find'](valueToFind).p(LF)
  ['keyIndex field'](KEY_FIELD)['value field'](VALUE_FIELD).p(LF)
  ['result'](table.lookupMany(valuesToFind, KEY_FIELD, VALUE_FIELD, false) |> deco)
  |> says['table ' + TITLE]
