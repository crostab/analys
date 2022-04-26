'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// from x => typeof x
const FUN = 'function';

/**
 *
 * @param {CrosTab|CrostabObject} table
 * @param {[*,*,*]|{from:[*,*,*],by:function,to:function}} [conf]
 * @returns {Generator<*, void, *>}
 */

function* indexed(table, conf) {
  const by = conf === null || conf === void 0 ? void 0 : conf.by,
        to = conf === null || conf === void 0 ? void 0 : conf.to;

  if (typeof by === FUN) {
    if (typeof to === FUN) {
      yield* filterMappedIndexed(table, conf);
    } else {
      yield* filterIndexed(table, conf);
    }
  } else {
    if (typeof to === FUN) {
      yield* mappedIndexed(table, conf);
    } else {
      yield* simpleIndexed(table, (conf === null || conf === void 0 ? void 0 : conf.from) ?? conf);
    }
  }
}
function* simpleIndexed(table, from) {
  const {
    head,
    rows
  } = table;
  const [i, j, k] = from.map(x => head.indexOf(x));

  for (let row of rows) {
    yield [row[i], row[j], row[k]];
  }
}
function* filterIndexed(table, {
  from,
  by
}) {
  const {
    head,
    rows
  } = table;
  const [i, j, k] = from.map(x => head.indexOf(x));

  for (let row of rows) {
    const x = row[i],
          y = row[j],
          v = row[k];
    if (by(x, y, v)) yield [x, y, v];
  }
}
function* mappedIndexed(table, {
  from,
  to
}) {
  const {
    head,
    rows
  } = table;
  const [i, j, k] = from.map(x => head.indexOf(x));

  for (let row of rows) {
    yield to(row[i], row[j], row[k]);
  }
}
function* filterMappedIndexed(table, {
  from,
  by,
  to
}) {
  const {
    head,
    rows
  } = table;
  const [i, j, k] = from.map(x => head.indexOf(x));

  for (let row of rows) {
    const x = row[i],
          y = row[j],
          v = row[k];
    if (by(x, y, v)) yield to(x, y, v);
  }
}

exports.filterIndexed = filterIndexed;
exports.filterMappedIndexed = filterMappedIndexed;
exports.indexed = indexed;
exports.mappedIndexed = mappedIndexed;
exports.simpleIndexed = simpleIndexed;
