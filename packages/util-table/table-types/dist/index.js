import { vectorType } from '@typen/vector-type';
import { columnsMapper } from '@vect/columns-mapper';

// { inferType, omitNull = true }
const inferTypes = function (options = {}) {
  return columnsMapper(this?.rows, vectorType.bind(options))
};

export { inferTypes };
