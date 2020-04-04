import { mapper } from '@vect/columns-mapper';
import { vectorType } from '@typen/vector-type';

const inferTypes = function ({
  inferType
} = {}) {
  const table = this;
  return mapper(table.rows, vectorType.bind(inferType));
};

export { inferTypes };
