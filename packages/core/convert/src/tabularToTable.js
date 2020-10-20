import { Table } from '@analys/table'

/**
 *
 * @param {Object} o
 * @returns {Table}
 */
export const toTable = (o) => new Table(o.head || o.banner, o.rows || o.matrix, o.title, o.types)