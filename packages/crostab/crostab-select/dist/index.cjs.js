'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rand = require('@aryth/rand');
var crostabInit = require('@analys/crostab-init');
var vectorSelect = require('@vect/vector-select');
var tabular = require('@analys/tabular');
var keyedRows = require('@analys/keyed-rows');

const MEAN = 4;
function crostabShuffle(crostab, {
  h,
  w,
  oscillate
} = {}) {
  var _crostab;

  crostab = (_crostab = crostab, crostabInit.matchSlice(_crostab));
  if (!h || oscillate) h = rand.randIntBetw(MEAN - 1, MEAN + 4);
  if (!w || oscillate) w = rand.randIntBetw(MEAN - 1, MEAN + 1);
  const sideSelection = vectorSelect.leap(crostab.side, rand.flopIndex(crostab.side), h),
        headSelection = vectorSelect.shuffle(crostab.head, w);
  if (sideSelection === null || sideSelection === void 0 ? void 0 : sideSelection.length) keyedRows.selectKeyedRows.call(crostab, sideSelection);
  if (headSelection === null || headSelection === void 0 ? void 0 : headSelection.length) tabular.selectTabular.call(crostab, headSelection);
  return crostab;
}

exports.crostabShuffle = crostabShuffle;
