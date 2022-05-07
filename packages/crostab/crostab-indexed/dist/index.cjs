'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// from x => typeof x
const FUN = 'function';

function* indexedOf(crostab) {
  const {
    side,
    head,
    rows
  } = crostab;
  const h = side === null || side === void 0 ? void 0 : side.length,
        w = head === null || head === void 0 ? void 0 : head.length;

  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) yield [side[i], head[j], rows[i][j]];
}
function* indexedBy(crostab, by) {
  const {
    side,
    head,
    rows
  } = crostab;
  const h = side === null || side === void 0 ? void 0 : side.length,
        w = head === null || head === void 0 ? void 0 : head.length;

  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) if (by(side[i], head[j], rows[i][j])) yield [side[i], head[j], rows[i][j]];
}
function* indexedTo(crostab, to) {
  const {
    side,
    head,
    rows
  } = crostab;
  const h = side === null || side === void 0 ? void 0 : side.length,
        w = head === null || head === void 0 ? void 0 : head.length;

  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) yield to(side[i], head[j], rows[i][j]);
}
function* indexed(crostab, by, to) {
  if (!by && !to) return yield* indexedOf(crostab);
  if (!to) return yield* indexedBy(crostab, by);
  const {
    side,
    head,
    rows
  } = crostab;
  const h = side === null || side === void 0 ? void 0 : side.length,
        w = head === null || head === void 0 ? void 0 : head.length;

  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) if (by(side[i], head[j], rows[i][j])) yield to(side[i], head[j], rows[i][j]);
}
/**
 *
 * @param {CrosTab|CrostabObject} crostab
 * @param {function|{by:function,to:function}} [conf]
 * @returns {Generator<*, void, *>}
 */

function* indexedVia(crostab, conf) {
  const by = conf === null || conf === void 0 ? void 0 : conf.by,
        to = (conf === null || conf === void 0 ? void 0 : conf.to) ?? conf;
  yield* typeof by === FUN ? typeof to === FUN ? indexed(crostab, by, to) : indexedBy(crostab, by) : typeof to === FUN ? indexedTo(crostab) : indexedOf(crostab);
}

exports.filterIndexed = indexedBy;
exports.filterMappedIndexed = indexedVia;
exports.indexed = indexed;
exports.indexedBy = indexedBy;
exports.indexedOf = indexedOf;
exports.indexedTo = indexedTo;
exports.indexedVia = indexedVia;
exports.mappedIndexed = indexedTo;
exports.simpleIndexed = indexedOf;
