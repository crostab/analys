import { Table } from '@analys/table'

export const TableCollection = {
  continued: Table.from({
    head: ['symbol', 'date', 'perf', 'quant'],
    rows: [
      ['foo', '2019-09-30', 9, 90],
      ['foo', '2019-06-30', 6, 60],
      ['foo', '2019-03-31', 3, 30],
      ['foo', '2018-12-31', 12, 120],
      ['foo', '2018-09-30', 9, 90],
      ['foo', '2018-06-30', 6, 60],
      ['foo', '2018-03-31', 3, 30],
      ['foo', '2017-12-31', 12, 120],
    ],
  }),
  discontinued: Table.from({
    head: ['symbol', 'date', 'perf', 'quant'],
    rows: [
      ['foo', '2019-09-30', 9, 90],
      ['foo', '2019-06-30', 6, 60],
      ['foo', '2018-12-31', 12, 120],
      ['foo', '2018-06-30', 6, 60],
      ['foo', '2018-03-31', 3, 30],
      ['foo', '2017-12-31', 12, 120],
    ],
  })
}
