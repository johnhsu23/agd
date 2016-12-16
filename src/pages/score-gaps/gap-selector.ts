import {Model, EventsHash} from 'backbone';
import {select} from 'd3-selection';
import * as $ from 'jquery';

import D3View from 'views/d3';
import * as vars from 'data/variables';
import configure from 'util/configure';

import * as template from 'text!templates/gap-selector.html';

@configure({
  className: 'gap-selector',
})
export default class GapSelector extends D3View<HTMLDivElement, Model> {
  protected variable = vars.SDRACE;
  protected focal = 0;
  protected target = 1;

  template = () => template;

  events(): EventsHash {
    return {
      'change select[data-category=focal]': 'onFocalChange',
      'change select[data-category=target]': 'onTargetChange',
    };
  }

  render(): this {
    super.render();

    const selects = this.$('select').selectability();

    const varsArray = [vars.SDRACE, vars.GENDER, vars.SLUNCH3, vars.PARED,
       vars.SCHTYPE, vars.UTOL4, vars.CENSREG, vars.IEP, vars.LEP];

    /*
     * Structure of focal category selector:
     *
     * - select
     *   - optgroup[label = "Race/Ethnicity"]
     *     - option[value = 0] White
     *     - option[value = 1] Black
     *       ...
     *   - optgroup[label = "Gender"]
     *     - option[value = 0] Male
     *     - option[value = 1] Female
     *   ...
     *
     * This is rendered statically, since we won't ever change the choice of focal categories on the user.
     * (We don't have this luxury for target categories, though.)
     */
    select(selects[0])
      // <select>
      //   <optgroup>
      //   ^^^^^^^^^^ - you are here
      .selectAll('optgroup')
      .data(varsArray)
      .enter()
      .append<HTMLOptGroupElement>('optgroup')
      .property('label', v => v.name)
      // <select>
      //   <optgroup>
      //     <option>
      //     ^^^^^^^^ - you are here
      .selectAll('option')
      // The data structure here is a bit messy, but it serves a purpose.
      // By putting the variable and focal category in this triple alongside the category label,
      // we can read out the variable and category in our onFocalChange() event handler using
      // d3.select().
      //
      // This avoids string parsing and lookups since we already know what's what.
      .data(v => v.categories.map((cat, i) => [v, i, cat] as [vars.Variable, number, string]))
      .enter()
      .append<HTMLOptionElement>('option')
      // Default focal category is Male under SDRACE
      .property('checked', ([v], i) => v === vars.SDRACE && i === 0)
      // The value attribute isn't actually used, but putting something
      // here makes it easier to debug the output in the browser.
      .property('value', d => d[0].id + '-' + d[1])
      .text(d => d[2]);

    this.populateTarget();

    selects.trigger('change');

    return this;
  }

  protected populateTarget(): void {
    const categories = this.variable.categories
      // We need to look up the index into the categories array, but the call to .filter() below breaks the
      // naive approach
      // So we store it here in a tuple
      .map((cat, i) => [cat, i])
      .filter(d => d[1] !== this.focal);

    const select = this.select('select[data-category=target]'),
          update = select.selectAll('option')
            .data(categories);

    update.exit()
      .remove();

    update.enter()
      .append('option')
      .merge(update)
      .property('value', d => d[1])
      .text(d => d[0]);

    $(select.node())
      .val(this.target)
      .trigger('change');
  }

  protected onFocalChange(event: SelectabilityEvent): void {
    if (!event.selectability) {
      return;
    }

    const options = (event.target as HTMLSelectElement).selectedOptions,
          [variable, focal] = select<Element, [vars.Variable, number]>(options[0]).datum();

    if (this.variable !== variable) {
      // When switching variables, reset the target category to 0, or 1 if the user picked category 0.
      this.target = +(focal === 0);
    } else if (this.target === focal) {
      // If the new focal category is the same as the present target category, then put the old
      // focal category into the target: this effectively swaps the focal and target categories
      // from the point of view of the user.
      this.target = this.focal;
    }

    // Update only after we've done the above checks
    this.variable = variable;
    this.focal = focal;

    this.populateTarget();
    this.changed();
  }

  protected onTargetChange(event: SelectabilityEvent): void {
    if (!event.selectability) {
      return;
    }

    this.target = +event.val;
    this.changed();
  }

  protected changed(): void {
    this.triggerMethod('gap:select', this.variable, this.focal, this.target);
  }
}
