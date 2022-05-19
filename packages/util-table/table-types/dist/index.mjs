import { vectorType } from '@typen/vector-type';
import { columnsMapper } from '@vect/columns-mapper';

const inferTypes = function (options = {}) {
  return columnsMapper(this === null || this === void 0 ? void 0 : this.rows, vectorType.bind(options));
};

export { inferTypes };
