import {Model} from 'backbone';
import modelProperty from 'util/model-property';

class Grade extends Model {
  @modelProperty()
  grade: number;
}

const grade = new Grade({
  grade: 4,
});

export default grade;
export {
  Grade,
  grade,
};
