import { mapper } from '@vect/columns-mapper';
import { VectorType } from '@typen/vector-type';

const inferTypes = function ({
  inferType,
  omitNull = true
} = {}) {
  const table = this;
  return mapper(table.rows, VectorType({
    inferType,
    omitNull
  }));
};

export { inferTypes };
