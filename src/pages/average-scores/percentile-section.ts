import SectionView from 'views/section';
import Figure from 'pages/average-scores/percentile-figure';

export default class PercentileSectionView extends SectionView {
  onBeforeShow(): void {
    console.log(this);

    this.showChildView('inner', new Figure);
  }
}
