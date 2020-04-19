import { DATE, SYMBOL }    from '@glossa/enum-fin'
import { deco, decoTable } from '@spare/logger'
import { logger }          from '@spare/logger'
import { TableCollection } from '../../assets/tableCollection'
import { differentialOri } from './differentialOri'

// for (const [name, table] of Object.entries(TableCollection)) {
differentialOri(TableCollection.continued, { dateLabel: DATE, excluded: [SYMBOL] }) |> decoTable |> logger
// }
