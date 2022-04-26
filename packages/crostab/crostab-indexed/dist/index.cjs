'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// from x => typeof x
const FUN = 'function';

/**
 *
 * @param {CrosTab|CrostabObject} crostab
 * @param {function|{by:function,to:function}} [conf]
 * @returns {Generator<*, void, *>}
 */

function* indexed(crostab, conf) {
  const by = conf === null || conf === void 0 ? void 0 : conf.by,
        to = (conf === null || conf === void 0 ? void 0 : conf.to) ?? conf;

  if (typeof by === FUN) {
    if (typeof to === FUN) {
      yield* filterMappedIndexed(crostab, conf);
    } else {
      yield* filterIndexed(crostab, by);
    }
  } else {
    if (typeof to === FUN) {
      yield* mappedIndexed(crostab);
    } else {
      yield* simpleIndexed(crostab);
    }
  }
}
function* simpleIndexed(crostab) {
  const {
    side,
    head,
    rows
  } = crostab;
  const h = side === null || side === void 0 ? void 0 : side.length,
        w = head === null || head === void 0 ? void 0 : head.length;

  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) yield [side[i], head[j], rows[i][j]];
}
function* filterIndexed(crostab, filter) {
  const {
    side,
    head,
    rows
  } = crostab;
  const h = side === null || side === void 0 ? void 0 : side.length,
        w = head === null || head === void 0 ? void 0 : head.length;

  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) if (filter(side[i], head[j], rows[i][j])) yield [side[i], head[j], rows[i][j]];
}
function* mappedIndexed(crostab, mapper) {
  const {
    side,
    head,
    rows
  } = crostab;
  const h = side === null || side === void 0 ? void 0 : side.length,
        w = head === null || head === void 0 ? void 0 : head.length;

  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) yield mapper(side[i], head[j], rows[i][j]);
}
function* filterMappedIndexed(crostab, {
  by,
  to
}) {
  const {
    side,
    head,
    rows
  } = crostab;
  const h = side === null || side === void 0 ? void 0 : side.length,
        w = head === null || head === void 0 ? void 0 : head.length;

  for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) if (by(side[i], head[j], rows[i][j])) yield to(side[i], head[j], rows[i][j]);
}

exports.filterIndexed = filterIndexed;
exports.filterMappedIndexed = filterMappedIndexed;
exports.indexed = indexed;
exports.mappedIndexed = mappedIndexed;
exports.simpleIndexed = simpleIndexed;
