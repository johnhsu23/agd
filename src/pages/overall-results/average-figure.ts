import Figure from 'views/figure';
import context from 'models/context';
import AverageResults from 'pages/overall-results/average-results';

export default class AverageFigure extends Figure {
  protected makeTitle(): string {
    return `Average responding scale scores for eighth-grade students assessed in NAEP ` +
     `${context.subject}: 2008 and 2016`;
  }

  onBeforeShow(): void {
    this.setTitle(this.makeTitle());
    this.showContents(new AverageResults);
  }
}
