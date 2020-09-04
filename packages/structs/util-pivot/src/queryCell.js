

export const queryCell = function (x, y) {
  return (x = qrid.call(this, x)) >= 0 && (y = qcid.call(this, y)) >= 0 ? this.rows[x][y] : void 0
}

export const qrid = function (x) { return this.side.indexOf(x) }
export const qcid = function (y) { return this.head.indexOf(y) }


