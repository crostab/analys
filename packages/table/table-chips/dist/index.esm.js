import { MERGE, ACCUM, INCRE, COUNT } from '@analys/enum-pivot-mode';

const acquire = (va, vb) => (Array.prototype.push.apply(va, vb), va); // export default Function.prototype.call.bind(Array.prototype.concat)


const tallyMerge = (target, value) => acquire(target, value);

const tallyAccum = (target, value) => (target.push(value), target);

const findEntry = function (key) {
  return this.find(([k]) => key === k);
};
const EntriesRecorder = mode => {
  if (mode === MERGE) return function (x, v) {
    const en = findEntry.call(this, x);

    if (en) {
      tallyMerge(en[1], v);
    } else {
      this.push([x, v.slice()]);
    }
  };
  if (mode === ACCUM) return function (x, v) {
    const en = findEntry.call(this, x);

    if (en) {
      tallyAccum(en[1], v);
    } else {
      this.push([x, [v]]);
    }
  };
  if (mode === INCRE) return function (x, v) {
    const en = findEntry.call(this, x);

    if (en) {
      en[1] += v;
    } else {
      this.push([x, v]);
    }
  };
  if (mode === COUNT) return function (x) {
    const en = findEntry.call(this, x);

    if (en) {
      en[1]++;
    } else {
      this.push([x, 1]);
    }
  };
  return () => {};
};

const ObjectRecorder = mode => {
  if (mode === MERGE) return function (x, v) {
    if (x in this) {
      tallyMerge(this[x], v);
    } else {
      this[x] = v.slice();
    }
  };
  if (mode === ACCUM) return function (x, v) {
    if (x in this) {
      tallyAccum(this[x], v);
    } else {
      this[x] = [v];
    }
  };
  if (mode === INCRE) return function (x, v) {
    if (x in this) {
      this[x] += v;
    } else {
      this[x] = v;
    }
  };
  if (mode === COUNT) return function (x) {
    if (x in this) {
      this[x]++;
    } else {
      this[x] = 1;
    }
  };
  return () => {};
};

const tableChips = function ({
  key,
  field,
  mode = ACCUM,
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

export { tableChips };
