'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vectorInit = require('@vect/vector-init');
var dataGram = require('@analys/data-gram');

const indexOfWords = (wordsList, words) => {
  return wordsList.findIndex(ve => ve.every((width, i) => width === words[i]));
};

class NestGram extends dataGram.DataGram {
  // /** @type {*[]} */ side
  // /** @type {*[]} */ head
  // /** @type {*[][]} */ rows
  // /** @type {Function} */ init
  constructor(init) {
    super(init);
  }

  static build(init) {
    return new NestGram(init);
  } // query(x, y) {
  //   return (x = this.sideIndex(x)) >= 0 && (y = this.headIndex(y)) >= 0
  //     ? this.rows[x][y]
  //     : undefined
  // }
  //
  // cell(x, y) {
  //   return this.rows[this.upSideIndex(x)][this.upHeadIndex(y)]
  // }


  querySide(xs) {
    return indexOfWords(this.side, xs);
  }

  queryHead(ys) {
    return indexOfWords(this.head, ys);
  }

  roin(xs) {
    const ri = indexOfWords(this.side, xs);
    if (ri >= 0) return ri;
    return this.rows.push(vectorInit.init(this.head.length, this.init)), ri + this.side.push(xs.slice());
  }

  coin(ys) {
    const ci = indexOfWords(this.head, ys);
    if (ci >= 0) return ci;
    return this.rows.forEach(r => r.push(this.init())), ci + this.head.push(ys.slice());
  }

}

exports.NestGram = NestGram;
