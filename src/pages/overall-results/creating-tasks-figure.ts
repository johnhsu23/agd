import Figure from 'views/figure';
import Chart from 'pages/overall-results/creating-tasks-chart';

export default class CreatingTasksBar extends Figure {
  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.showContents(new Chart);
  }
}
