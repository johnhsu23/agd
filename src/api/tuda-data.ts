export interface Params {
  type: 'tuda-data';

  subscale?: string;
  subject: string;
  grade: number;

  variable: string;
  categoryindex: number | number[];

  year: string | string[];

  stattype: string | string[];
  jurisdiction: string;
}

export interface Data {
  year: number;
  accommodations: number;

  stattype: string;
  subject: string;
  grade: number;

  jurisdiction: string;

  variable: string;
  category: string;
  categoryindex: number;

  value: number;

  isStatDisplayable: number;
  errorFlag: number;
  gap: number;
  sig: string;
}
