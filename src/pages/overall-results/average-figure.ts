import Figure from 'views/figure';
import AverageResults from 'pages/overall-results/average-results';

export default class AverageFigure extends Figure {

  protected makeTitle(): string {
    return `Eighth-grade NAEP arts average scores`;
  }

  onBeforeShow(): void {
    this.setTitle(this.makeTitle());
    this.showContents(new AverageResults);
  }
}
