const coin = function (field) {
  return this.head.indexOf(field)
};

const coins = function (fields) {
  return fields.map(coin.bind(this))
};

export { coin, coins };
