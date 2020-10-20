import { Formula }      from '@analys/formula'
import { tableFind }    from '@analys/table-find'
import { slice }        from '@analys/table-init'
import { tableAcquire } from '@analys/table-merge'

export const tableFormulaOri = function ({
  fields,
  formulas,
  filter,
  append = true
} = {}) {
  const table = slice(this)
  if (filter) { tableFind.call(table, filter) }
  const { head, rows } = table
  fields = fields.map(name => head.indexOf(name), this)
  const formulaEngine = new Formula(fields, formulas)
  const calc = {
    head: formulaEngine.indexes,
    rows: formulaEngine.calculate(rows).toRows()
  }
  return append ? tableAcquire(table, calc) : calc
}
