import {Variable} from 'data/variables';
import context from 'models/context';

export {Variable};

/*
 * Visual Arts variables
 */

// In-school student actvities and interests

export const BV00003: Variable = {
  id: 'BV00003',
  name: 'I have a talent for art',
  categories: [
    'Agree',
    'Not sure',
    'Disagree',
  ],
};

export const BV00007: Variable = {
  id: 'BV00007',
  name: 'Are you taking art (now or this year)',
  categories: [
    'Yes',
    'No',
  ],
};

export const BV00008: Variable = {
  id: 'BV00008',
  name: 'Paint or draw in art',
  categories: [
    'Every day',
    'Once a week',
    'Once a month',
    'Never or hardly ever',
  ],
};

export const BV00019: Variable = {
  id: 'BV00019',
  name: 'Keep a portfolio in art',
  categories: [
    'Yes',
    'No',
  ],
};

// In-school opportunity

export const SQ00901: Variable = {
  id: 'SQ00901',
  name: 'Full-time specialist in visual arts',
  categories: [
    'Yes',
    'No',
  ],
};

export const SQ00204: Variable = {
  id: 'SQ00204',
  name: 'State or district curriculum',
  categories: [
    'Yes',
    'No',
  ],
};

export const SQ00072: Variable = {
  id: 'SQ00072',
  name: 'Visual arts space',
  categories: [
    'Not Taught',
    'Studio with equipment',
    'Room with no equipment',
    'Art On A Cart/None',
    'Classroom only',
    'Other',
  ],
};

// Out of school

export const BV80022: Variable = {
  id: 'BV80022',
  name: 'Go to a museum',
  categories: [
    'Yes',
    'No',
  ],
};

export const BV80023: Variable = {
  id: 'BV80023',
  name: 'Take art class',
  categories: [
    'Yes',
    'No',
  ],
};

export const BV80024: Variable = {
  id: 'BV80024',
  name: 'Make art work',
  categories: [
    'Yes',
    'No',
  ],
};

export const BV00018: Variable = {
  id: 'BV00018',
  name: 'Keep a sketchbook',
  categories: [
    'Yes',
    'No',
  ],
};

export const BV80030: Variable = {
  id: 'BV80030',
  name: 'Discuss art with family and friends',
  categories: [
    'Yes',
    'No',
  ],
};

/*
 * Music contextual variables
 */

// In-school student activities

export const BM00003: Variable = {
  id: 'BM00003',
  name: 'I have a talent in music',
  categories: [
    'Agree',
    'Not Sure',
    'Disagree',
  ],
};

// (This space reserved for whatever variable covers "Writing music down")

export const BM80013: Variable = {
  id: 'BM80013',
  name: 'Play in a band',
  categories: [
    'Yes',
    'No',
  ],
};

export const BM80015: Variable = {
  id: 'BM80015',
  name: 'Sing in a choir or chorus',
  categories: [
    'Yes',
    'No',
  ],
};

// In-school opportunity

export const SQ00202: Variable = {
  id: 'SQ00202',
  name: 'District/state curriculum on music',
  categories: [
    'Yes',
    'No',
  ],
};

export const SQ00701: Variable = {
  id: 'SQ00701',
  name: 'Full-time specialist in music',
  categories: [
    'Yes',
    'No',
  ],
};

export const SQ00070: Variable = {
  id: 'SQ00070',
  name: 'Dedicated space for music',
  categories: [
    'Music Not Taught',
    'Room and Stage',
    'Room with no stage',
    'Stage with no room',
    'Classroom only',
    'Other',
  ],
};

// Out of school

export const BM80023: Variable = {
  id: 'BM80023',
  name: 'Play instrument on your own',
  categories: [
    'Yes',
    'No',
  ],
};

export const BM80030: Variable = {
  id: 'BM80030',
  name: 'Talk about music',
  categories: [
    'Yes',
    'No',
  ],
};

export const BM80034: Variable = {
  id: 'BM80034',
  name: 'Heard music in a theater',
  categories: [
    'Yes',
    'No',
  ],
};

export const BM80024: Variable = {
  id: 'BM80024',
  name: 'Take private lessons',
  categories: [
    'Yes',
    'No',
  ],
};

/**
 * Looks up contextual variables given their ID.
 */
export const contextualVariablesById: { [id: string]: Variable } = Object.freeze({
  // Visual Arts variables
  // In-school student activities and interests
  BV00003,
  BV00007,
  BV00008,
  BV00019,
  // In-school opportunity
  SQ00901,
  SQ00204,
  SQ00072,
  // Out of school
  BV80022,
  BV80023,
  BV80024,
  BV00018,
  BV80030,

  // Music variables
  // In-school student activities
  BM00003,
  BM80013,
  BM80015,
  // In-school opportunity
  SQ00202,
  SQ00701,
  SQ00070,
  // Out of school
  BM80023,
  BM80030,
  BM80034,
  BM80024,
});

/**
 * Retrieves all contextual variables for a given subject.
 */
export function contextualVariablesForSubject(subject: 'visual arts' | 'music'): Variable[] {
  if (subject === 'visual arts') {
    return [
      // In-school student activities and interests
      BV00003,
      BV00007,
      BV00008,
      BV00019,
      // In-school opportunity
      SQ00901,
      SQ00204,
      SQ00072,
      // Out of school
      BV80022,
      BV80023,
      BV80024,
      BV00018,
      BV80030,
    ];
  } else {
    return [
      // In-school student activities
      BM00003,
      BM80013,
      BM80015,
      // In-school opportunity
      SQ00202,
      SQ00701,
      SQ00070,
      // Out of school
      BM80023,
      BM80030,
      BM80034,
      BM80024,
    ];
  }
}

/**
 * Returns the contextual variables for the current subject (as defined by the global `context` model).
 */
export function contextualVariables(): Variable[] {
  return contextualVariablesForSubject(context.subject);
}
