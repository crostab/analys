export const coin = function (field) {
  return this.head.indexOf(field)
}

export const coins = function (fields) {
  return fields.map(coin.bind(this))
}
