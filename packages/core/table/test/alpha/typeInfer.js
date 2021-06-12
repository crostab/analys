import { mapper as mapperColumns } from '@vect/columns-mapper'

/**
 *
 * Specify the type of a column. No return
 * @param {str} field accept both column name in string or column index in integer
 * @param {string} typeName string | (number, float) | integer | boolean
 */
function changeType(field, typeName) {
  const y = this.coin(field), parser = parserSelector(typeName)
  if (parser) mutateColumn(this.rows, y, parser, this.height), this.types[y] = typeName
  return this
}

/**
 * Re-generate this._types based on DPTyp.inferArr method.
 * Cautious: This method will change all elements of this._types.
 * @return {string[]}
 */
function mutInferTypes() {
  this.types = mapperColumns(this.rows, inferArrayType)
  for (let [ i, typeName ] of this.types.entries()) {
    if (typeName === 'numstr') { this.changeType(i, 'number') }
    else if (typeName === 'misc') { this.changeType(i, 'string') }
  }
  return this.types
}
