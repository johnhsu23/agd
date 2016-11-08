export interface Params {
  type: 'tuda-gap';

  subscale?: string;
  subject: string;
  grade: number;

  variable: string;
  categoryindex: number;
  categoryindexb: number | number[];

  stattype: string;

  jurisdiction: string;
  year: number[];
}

export interface Data {
  year: number;
  accommodations: number;
  stattype: string;

  subject: string;
  grade: number;

  variable: string;
  category: string;
  categoryindex: number;
  categoryb: string;
  categorybindex: number;

  focalValue: number;
  isFocalStatDisplayable: number;
  focalErrorFlag: number;

  targetValue: number;
  isTargetStatDisplayable: number;
  targetErrorFlag: number;

  isSigDisplayable: number;
  gap: number;

  sig: string;
}
