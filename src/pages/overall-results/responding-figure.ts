import Figure from 'views/figure';
import context from 'models/context';
import Chart from 'pages/overall-results/responding-chart';

export default class RespondingFigure extends Figure {
  protected makeTitle(): string {
    return `Average creating task scores for eighth-grade students assessed in
    NAEP ${context.subject}, by responding score level: 2016`;
  }

  onBeforeShow(): void {
    this.setTitle(this.makeTitle());
    this.showContents(new Chart);
  }
}
