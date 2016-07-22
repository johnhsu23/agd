import {Model} from 'backbone';
import modelProperty from 'util/model-property';

class Context extends Model {
  @modelProperty()
  grade: number;
}

const context = new Context({
  grade: 4,
});

export default context;
export {
  Context,
  context,
};
