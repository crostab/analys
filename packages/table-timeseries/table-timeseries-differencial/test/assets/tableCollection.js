import { Table } from '@analys/table'

export const TableCollection = {
  continued: Table.from({
    head: ['symbol', 'date', 'perf', 'quant', 'value'],
    rows: [
      ['foo', '2019-12-31', 10, 100, null],
      ['foo', '2019-09-30', 9, 90, null],
      ['foo', '2019-06-30', 6, 60, 16],
      ['foo', '2019-03-31', 3, 30, null],
      ['foo', '2018-12-31', 12, 120, null],
      ['foo', '2018-09-30', 9, 90, 1],
      ['foo', '2018-06-30', 6, 60, 2],
      ['foo', '2018-03-31', 3, 30, 1],
      ['foo', '2017-12-31', 12, 120, null],
      ['foo', '2017-09-30', 10, 100, null],
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
