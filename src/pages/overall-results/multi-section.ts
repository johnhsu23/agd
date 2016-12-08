import {View} from 'backbone.marionette';
import {Model} from 'backbone';

import configure from 'util/configure';
import {default as Section, Dict} from 'views/section';

@configure({
  className: 'section__inner',
})
export default class MultiSection extends Section {
  template = () => `<div class="section__title"></div>
<div class="section__controls"></div>
<div class="section__subtitle"></div>`;

  protected count = 0;

  setCommentary(commentary: Dict): void {
    const {title, subtitle} = commentary;

    this.$('.section__title')
      .html(title);
    this.$('.section__subtitle')
      .html(subtitle);
  }

  addSection(view: View<Model>, commentary?: Dict): void {
    if (commentary && commentary['commentary']) {
      const commentaryElt = document.createElement('div');
      commentaryElt.setAttribute('class', 'section__commentary');
      commentaryElt.innerHTML = commentary['commentary'];

      this.el.appendChild(commentaryElt);
    }

    const count = this.count++,
          region = 'section-' + count;

    const section = document.createElement('div');
    section.setAttribute('class', 'section__contents');
    this.el.appendChild(section);

    this.addRegion(region, {
      el: section,
    });

    this.showChildView(region, view);
  }
}
