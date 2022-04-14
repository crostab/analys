'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const coin = function (field) {
  return this.head.indexOf(field);
};
const coins = function (fields) {
  return fields.map(coin.bind(this));
};

exports.coin = coin;
exports.coins = coins;
