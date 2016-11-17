export interface Params {
  type: 'tuda-gaponvar-acrossyear';

  subject: 'visual arts' | 'music';
  subscale: 'VISRP' | 'MUSRP';
  grade: 8;

  variable: string;
  categoryindex: number;
  categoryindexb: number | number[];

  stattype: string;

  jurisdiction: string;

  focalyear: '2016R3';
  targetyears: string[];
}

export interface Data {
  stattype: string;
  subject: string;
  grade: number;
  jurisdiction: string;

  focalyear: number;
  focalaccommodations: number;
  focalcategory: string;
  focalcategoryindex: number;

  targetyear: number;
  targetaccommodations: number;
  targetcategory: string;
  targetcategoryindex: number;

  fyfvValue: number;
  fyfvDisplayable: number;
  fyfvErrorFlag: number;

  fytvValue: number;
  fytvDisplayable: number;
  fytvErrorFlag: number;

  fyDiffValue: number;
  fyDiffDisplayable: number;

  tyfvValue: number;
  tyfvDisplayable: number;
  tyfvErrorFlag: number;

  tytvValue: number;
  tytvDisplayable: number;
  tytvErrorFlag: number;

  tyDiffValue: number;
  tyDiffDisplayable: number;

  gap: number;
  sig: string;
}
