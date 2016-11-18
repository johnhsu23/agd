import {Model} from 'backbone';

export type LegendType = 'note' | 'text' | 'path' | 'gap';

export interface LegendAttributes {
  type: LegendType;
  marker: string;
  description: string;
  tag?: string;
}

export class Legend extends Model implements LegendAttributes {
  get type(): LegendType {
    return this.get('type');
  }

  set type(value: LegendType) {
    this.set('type');
  }

  get marker(): string {
    return this.get('marker');
  }

  set marker(value: string) {
    this.set('marker', value);
  }

  get description(): string {
    return this.get('description');
  }

  set description(value: string) {
    this.set('description', value);
  }

  set tag(value: string) {
    this.set('tag', value);
  }

  get tag(): string {
    return this.get('tag');
  }

  constructor(attributes: LegendAttributes, options?: any) {
    super(attributes, options);
  }
}

export default Legend;
