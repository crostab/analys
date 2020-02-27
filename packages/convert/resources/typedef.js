/**
 * A number, or a string containing a number.
 * @typedef {(number|string)} str
 * @typedef {{field:str,mode:number,filter:}} CubeCell
 * @typedef {{field:str,filter:function(*):boolean}} Filter
 * @typedef {{side:*[],head:*[],rows:*[][]}} CrostabObject
 * @typedef {{side:*[],rows:*[][]}} KeyedRows
 * @typedef {{head:*[],rows:*[][]}} TableObject
 * @typedef {{
 *  side:string,
 *  head:string,
 *  tableFilter:Filter[]|Filter,
 *  cell:CubeCell[]|CubeCell,
 *  formula:function():number,
 * }} TableSpec
 */
