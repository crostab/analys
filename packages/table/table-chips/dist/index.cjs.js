'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumPivotMode = require('@analys/enum-pivot-mode');

// export default Function.prototype.apply.bind(Array.prototype.push)
const acquire = (va, vb) => (Array.prototype.push.apply(va, vb), va); // export default Function.prototype.call.bind(Array.prototype.concat)

const entry = function (key) {
  return this.find(([k]) => key === k);
};
const EntriesRecorder = mode => {
  if (mode === enumPivotMode.INCRE) return function (x, v) {
    const en = entry.call(this, x);

    if (en) {
      en[1] += v;
    } else {
      this.push([x, v]);
    }
  };
  if (mode === enumPivotMode.ACCUM) return function (x, v) {
    const en = entry.call(this, x);

    if (en) {
      en[1].push(v);
    } else {
      this.push([x, [v]]);
    }
  };
  if (mode === enumPivotMode.COUNT) return function (x) {
    const en = entry.call(this, x);

    if (en) {
      en[1]++;
    } else {
      this.push([x, 1]);
    }
  };
  if (mode === enumPivotMode.MERGE) return function (x, v) {
    const en = entry.call(this, x);

    if (en) {
      acquire(en[1], v);
    } else {
      this.push([x, v]);
    }
  };
  return () => {};
};

const ObjectRecorder = mode => {
  if (mode === enumPivotMode.INCRE) return function (x, v) {
    if (x in this) {
      this[x] += v;
    } else {
      this[x] = v;
    }
  };
  if (mode === enumPivotMode.ACCUM) return function (x, v) {
    const ve = this[x];

    if (ve) {
      ve.push(v);
    } else {
      this[x] = [v];
    }
  };
  if (mode === enumPivotMode.COUNT) return function (x) {
    if (x in this) {
      this[x]++;
    } else {
      this[x] = 1;
    }
  };
  if (mode === enumPivotMode.MERGE) return function (x, v) {
    const ve = this[x];

    if (ve) {
      acquire(ve, v);
    } else {
      this[x] = v;
    }
  };
  return () => {};
};

const tableChips = function ({
  key,
  field,
  mode = enumPivotMode.ACCUM,
  objectify = true
} = {}) {
  const {
    head,
    rows
  } = this,
        l = rows.length;
  const ki = head.indexOf(key),
        vi = head.indexOf(field);
  let chips, row;
  const note = objectify ? ObjectRecorder(mode).bind(chips = {}) : EntriesRecorder(mode).bind(chips = []);

  for (let i = 0; i < l && (row = rows[i]); i++) note(row[ki], row[vi]);

  return chips;
};

exports.tableChips = tableChips;
