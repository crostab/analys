import { CrosTab } from '@analys/crostab';
import { Cubic } from '@analys/cubic';
import { parseField } from '@analys/tablespec';

/**
 * @typedef {string|number} str
 * @typedef {{head:*[],rows:*[][]}} TableObject
 */

/**
 * @param {str|str[]|Object<str,Function>|[string,Function][]} side
 * @param {str|str[]|Object<str,Function>|[string,Function][]} banner
 * @param {Object|*[]|string|number} [field]
 * @param {Object<string|number,function(*?):boolean>} [filter]
 * @param {function():number} [formula] - formula is valid only when cell is CubeCell array.
 */

/**
 *
 * @param {Table|TableObject} table
 * @returns {CrosTab}
 */

const tablePivot = function (table) {
  const {
    side,
    banner,
    field,
    formula
  } = this;
  const {
    head,
    rows
  } = table;

  const parseConf = keyConf => parseField(keyConf).map(({
    key,
    to
  }) => ({
    key: head.indexOf(key),
    to
  }));

  const sideConf = parseConf(side),
        bannerConf = parseConf(banner),
        fieldConf = parseConf(field);
  const pivotEngine = Cubic.build(sideConf, bannerConf, fieldConf);
  const crostab = CrosTab.from(pivotEngine.record(rows).toObject());

  if (formula) {
    if (fieldConf.length === 1) crostab.mutate(el => formula.call(null, el));
    if (fieldConf.length > 1) crostab.mutate(vec => formula.apply(null, vec));
  }

  return crostab;
};

export { tablePivot };
