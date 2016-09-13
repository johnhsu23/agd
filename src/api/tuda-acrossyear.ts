export interface Params {
  type: 'tuda-acrossyear';

  subscale?: string;
  subject: string;
  grade: number;

  variable: string;
  categoryindex: number | number[];

  targetyears: string[];
  focalyear: string;

  stattype: string | string[];
  jurisdiction: string;
}

export interface Data {
  focalyear: number;
  focalaccommodations: number;

  targetyear: number;
  targetaccommodations: number;

  stattype: string;
  subject: string;
  grade: number;

  jurisdiction: string;
  subScale: string;

  variable: string;
  category: string;
  categoryindex: number;

  focalvalue: number;
  isFocalStatDisplayable: number;
  FocalErrorFlag: number;

  targetvalue: number;
  isTargetStatDisplayable: number;
  TargetErrorFlag: number;

  isSigDisplayable: number;
  gap: number;
  sig: string;
}
