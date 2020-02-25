export const parserSelector = (typeName) => {
  switch (typeName) {
    case 'string':
      return String
    case 'number':
    case 'float':
      return Number.parseFloat
    case 'integer':
      return Number.parseInt
    case 'boolean':
      return Boolean
    default:
      return void 0
  }
}
