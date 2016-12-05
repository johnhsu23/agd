import Figure from 'views/figure';
import Chart from 'pages/overall-results/creating-tasks-chart';

export default class CreatingTasksBar extends Figure {
  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.setTitle('Average creating task score for eighth-grade students assessed in NAEP visual arts: 2016');
    this.showContents(new Chart);
  }
}
