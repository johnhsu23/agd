import context from 'models/context';

export type Classification = 'Responding' | 'Creating';

// NB. MC = multiple choice, SCR and ECR are both considered constructed-response.
export type Type = 'MC' | 'SCR' | 'ECR';

export interface SampleQuestion {
  /**
   * The NAEP ID of this sample question.
   */
  readonly naepid: string;

  /**
   * The display name of this sample question.
   */
  readonly name: string;

  /**
   * The classification of this question (either responding or creating).
   */
  readonly classification: Classification;

  /**
   * The type of question (multiple choice or constructed-response).
   */
  readonly type: Type;
}

/*
 * Visual arts
 */

// NQT ID: 2016-8A3 #3, ACCNUM WP000164
export const VC00003: SampleQuestion = {
  naepid: 'VC00003',
  name: 'Identify technical similarity in self-portraits',
  classification: 'Responding',
  type: 'MC',
};

// NQT ID: 2016-8A3 #2, ACCNUM LD000383
export const VC00002: SampleQuestion = {
  naepid: 'VC00002',
  name: 'Describe characteristics of charcoal in self-portrait',
  classification: 'Responding',
  type: 'SCR',
};

// NQT ID: 2016-8A3 #6, ACCNUM LD000387
export const VC000B6: SampleQuestion = {
  naepid: 'VC000B6',
  name: 'Create a self-portrait',
  classification: 'Creating',
  type: 'SCR',
};

// NQT ID: 2016-8A3 #1, ACCNUM LD000454
export const VC00001: SampleQuestion = {
  naepid: 'VC00001',
  name: 'Identify important aspect of composition',
  classification: 'Responding',
  type: 'MC',
};

// ACCNUM LD000458
// NB. This item is not in the NQT
export const VCCL004: SampleQuestion = {
  naepid: 'VCCL004',
  name: 'Relationship between technical approach and meaning',
  classification: 'Responding',
  type: 'SCR',
};

/*
 * Music
 */

// NQT ID: 2016-8A4 #2 UD00002; ACCNUM SL000017
export const UD00002: SampleQuestion = {
  naepid: 'UD00002',
  name: 'Identify texture of music',
  classification: 'Responding',
  type: 'MC',
};

// NQT ID: 2016-8A6 #4 UF00004; ACCNUM LD000910
export const UF00004: SampleQuestion = {
  naepid: 'UF00004',
  name: 'Identify the solo instrument',
  classification: 'Responding',
  type: 'MC',
};

// NQT ID: 2016-8A5 #5 UE00005; ACCNUM SL000086
export const UE00005: SampleQuestion = {
  naepid: 'UE00005',
  name: 'Identify appropriate time signature for music',
  classification: 'Responding',
  type: 'MC',
};

// NQT ID: 2016-8A5 #6 UE00006; ACCNUM SL000087
export const UE00006: SampleQuestion = {
  naepid: 'UE00006',
  name: 'Identify musical symbol and explain its meaning',
  classification: 'Responding',
  type: 'SCR',
};

// NQT ID: 2016-8A5 #7 UE00007; ACCNUM SL000088
export const UE00007: SampleQuestion = {
  naepid: 'UE00007',
  name: 'Identify type of note duration',
  classification: 'Responding',
  type: 'MC',
};

// NQT ID: 2016-8A5 #8 UECL008; ACCNUM LC000600
export const UECL008: SampleQuestion = {
  naepid: 'UECL008',
  name: 'Use notation to write an ending to a rhythmic pattern',
  classification: 'Creating',
  type: 'ECR',
};

// NQT ID: 2016-8A4 #9 UDCL009; ACCNUM SL000049
export const UDCL009: SampleQuestion = {
  naepid: 'UDCL009',
  name: 'Identify region where music comes from and explain why',
  classification: 'Responding',
  type: 'SCR',
};

/*
 * Helpers
 */

export function questions(): SampleQuestion[] {
  if (context.subject === 'visual arts') {
    return [
      VC00003,
      VC00002,
      VC000B6,
      VC00001,
      VCCL004,
    ];
  }

  return [
    UD00002,
    UF00004,
    UE00005,
    UE00006,
    UE00007,
    UECL008,
    UDCL009,
  ];
}
