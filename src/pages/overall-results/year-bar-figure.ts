import Figure from 'views/figure';
import Chart from 'pages/overall-results/year-bar-chart';

export default class TaskYearBar extends Figure {
  onRender(): void {
    if (super.onRender) {
      super.onRender();
    }

    this.showContents(new Chart);
  }
}
