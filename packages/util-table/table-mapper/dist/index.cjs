'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function* tripletIndexedOf(table, xyz) {
  const {
    head,
    rows
  } = table,
        [xi, yi, zi] = xyz.map(x => head.indexOf(x));

  for (let row of rows) {
    yield [row[xi], row[yi], row[zi]];
  }
}
function* tripletIndexedBy(table, xyz, by) {
  const {
    head,
    rows
  } = table,
        [xi, yi, zi] = xyz.map(x => head.indexOf(x));

  for (let row of rows) {
    const x = row[xi],
          y = row[yi],
          z = row[zi];
    if (by(x, y, z)) yield [x, y, z];
  }
}
function* tripletIndexedTo(table, xyz, to) {
  const {
    head,
    rows
  } = table,
        [xi, yi, zi] = xyz.map(x => head.indexOf(x));

  for (let row of rows) {
    yield to(row[xi], row[yi], row[zi]);
  }
}
/**
 *
 * @param {Table|TableObject} table
 * @param {[*,*,*]} xyz
 * @param {function(*,*,*):boolean} [by]
 * @param {function(*,*,*):*} [to]
 * @returns {Generator<*, void, *>}
 */

function* tripletIndexed(table, xyz, by, to) {
  if (!to) {
    return yield* !by ? tripletIndexedOf(table, xyz) : tripletIndexedBy(table, xyz, by);
  }

  const {
    head,
    rows
  } = table,
        [xi, yi, zi] = xyz.map(x => head.indexOf(x));

  for (let row of rows) {
    const x = row[xi],
          y = row[yi],
          z = row[zi];
    if (by(x, y, z)) yield to(x, y, z);
  }
}

function* entryIndexedOf(table, [k, v]) {
  const {
    head,
    rows
  } = table,
        ki = head.indexOf(k),
        vi = head.indexOf(v);

  for (let row of rows) {
    yield [row[ki], row[vi]];
  }
}
function* entryIndexedBy(table, [k, v], by) {
  const {
    head,
    rows
  } = table,
        ki = head.indexOf(k),
        vi = head.indexOf(v);

  for (let row of rows) {
    const x = row[ki],
          y = row[vi];
    if (by(x, y)) yield [x, y];
  }
}
function* entryIndexedTo(table, [k, v], to) {
  const {
    head,
    rows
  } = table,
        ki = head.indexOf(k),
        vi = head.indexOf(v);

  for (let row of rows) {
    yield to(row[ki], row[vi]);
  }
}
/**
 *
 * @param {Table|TableObject} table
 * @param {[*,*]} kv
 * @param {function(*,*):boolean} [by]
 * @param {function(*,*):*} [to]
 * @returns {Generator<*, void, *>}
 */

function* entryIndexed(table, kv, by, to) {
  if (!to) {
    return yield* !by ? entryIndexedOf(table, kv) : entryIndexedBy(table, kv, by);
  }

  const {
    head,
    rows
  } = table,
        ki = head.indexOf(kv[0]),
        vi = head.indexOf(kv[1]);

  for (let row of rows) {
    const x = row[ki],
          y = row[vi];
    if (by(x, y)) yield to(x, y);
  }
}

exports.entryIndexed = entryIndexed;
exports.entryIndexedBy = entryIndexedBy;
exports.entryIndexedOf = entryIndexedOf;
exports.entryIndexedTo = entryIndexedTo;
exports.tripletIndexed = tripletIndexed;
exports.tripletIndexedBy = tripletIndexedBy;
exports.tripletIndexedOf = tripletIndexedOf;
exports.tripletIndexedTo = tripletIndexedTo;
