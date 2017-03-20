import Figure from 'views/figure';
import context from 'models/context';
import Chart from 'pages/overall-results/responding-chart';

export default class RespondingFigure extends Figure {
  protected makeTitle(): string {
    return `Responding and creating task scores in ${context.subject} visual arts are related`;
  }

  onBeforeShow(): void {
    this.setTitle(this.makeTitle());
    this.showContents(new Chart);
  }
}
