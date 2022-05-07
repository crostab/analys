import { indexed }     from '@vect/object-mapper'
import { appendValue } from '@vect/object-update'

/**
 *
 * @param {Object} surject
 * @param {function(*,*):boolean} by
 * @param {function(*,*):[*,*]} to
 * @returns {Object<string,[]>}
 */
export const surjectToGrouped = (surject, by, to) => {
  const grouped = {}
  if (by || to) {
    for (let [ x, y ] of indexed(surject, by, to)) appendValue.call(grouped, y, x)
    return grouped
  }
  else {
    for (let x in surject) appendValue.call(grouped, surject[x], x)
    return grouped
  }

}

