import {Variable} from 'data/variables';
import context from 'models/context';

export interface ContextualVariable extends Variable {
  /**
   * The highlighted category of this contextual variable.
   */
  readonly selected: number;
}

/*
 * Visual Arts variables
 */

export const BV00003: ContextualVariable = {
  id: 'BV00003',
  name: 'How much do you agree that you think you have talent for art',
  title: 'the extent to which they agreed that they think they have talent for art',
  selected: 0,
  categories: [
    'Agree',
    'Not sure',
    'Disagree',
  ],
};

export const BV00007: ContextualVariable = {
  id: 'BV00007',
  name: 'Are you taking an art course now, or have you taken an art course this year',
  title: 'whether they took an art course in the school year',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const BV00008: ContextualVariable = {
  id: 'BV00008',
  name: 'When you have art in school, how often does your teacher have you paint or draw',
  title: 'the frequency with which their teachers asked them to paint or draw in art class',
  selected: 1, // Once a week
  categories: [
    'Every day',
    'Once a week',
    'Once a month',
    'Never or hardly ever',
  ],
};

export const BV00019: ContextualVariable = {
  id: 'BV00019',
  name: 'Do either you or your teacher save your artwork in a portfolio',
  title: 'whether they or their teacher saved their artwork in a portfolio',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const BV80022: ContextualVariable = {
  id: 'BV80022',
  name: 'When you are not in school, do you ever go to an art museum or exhibit on your own',
  title: 'whether they went to an art museum or exhibit on their own',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const BV80023: ContextualVariable = {
  id: 'BV80023',
  name: 'When you are not in school, do you ever take art classes',
  title: 'whether they took art classes not for schoolwork',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const BV80024: ContextualVariable = {
  id: 'BV80024',
  name: 'When you are not in school, do you ever make artwork on your own',
  title: 'whether they made artwork on their own not for schoolwork',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const BV80032: ContextualVariable = {
  id: 'BV80032',
  name: 'When you are not in school, do you ever keep an art journal or sketchbook on your own',
  title: 'whether they kept an art journal or sketchbook on their own',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const SQ00901: ContextualVariable = {
  id: 'SQ00901',
  name: 'Is there a full-time specialist on your school staff available to teach visual arts to eighth graders',
  title: [
    // This title is too long for tslint's 120-char limit
    'whether there was a full-time specialist was on their school staff',
    'available to teach visual arts to eighth graders',
  ].join(' '),
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const SQ00204: ContextualVariable = {
  id: 'SQ00204',
  name: 'Does your district or state have a curriculum in visual arts that your school is expected to follow',
  title: 'whether the district or state had a visual arts curriculum that their school was expected to follow',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const SQ00072: ContextualVariable = {
  id: 'SQ00072',
  name: 'Which best describes the space for the teaching of visual arts in your school',
  title: 'types of space for the teaching of visual arts in their school',
  selected: 1, // Art studio with special equipment
  categories: [
    'Visual arts are not taught',
    'Art studio with special equipment',
    'Room(s) dedicated to art but with no special equipment',
    'Art-on-a-cart/no dedicated space',
    'Classrooms only',
    'Other',
  ],
};

/*
 * Music variables
 */

export const BM00003: ContextualVariable = {
  id: 'BM00003',
  name: 'How much do you agree that you think you have talent for music',
  title: 'the extent to which they agreed that they think they have talent for music',
  selected: 0,
  categories: [
    'Agree',
    'Not sure',
    'Disagree',
  ],
};

export const BM00010: ContextualVariable = {
  id: 'BM00010',
  name: 'When you take music class in school, how often does your teacher ask you to write down music',
  title: 'the frequency with which their teachers asked them to write down music in music class',
  selected: 2, // At least once or twice a month
  categories: [
    'Almost every day',
    'Once or twice a week',
    'Once or twice a month',
    'Never or hardly ever',
    "I don't have music",
  ],
};

export const BM80013: ContextualVariable = {
  id: 'BM80013',
  name: 'Do you play in a band in school',
  title: 'whether they played in a band in school',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const BM80015: ContextualVariable = {
  id: 'BM80015',
  name: 'Do you sing in a chorus or choir in school',
  title: 'whether they sang in a chorus or choir in school',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const BM80023: ContextualVariable = {
  id: 'BM80023',
  name: 'When you are not in school, do you ever play a musical instrument on your own',
  title: 'whether they played a musical instrument on their own not for schoolwork',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const BM80024: ContextualVariable = {
  id: 'BM80024',
  name: 'When you are not in school, do you ever take private lessons on a musical instrument or in singing',
  title: 'whether they took private lessons on a musical instrument or in singing not for schoolwork',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const BM80030: ContextualVariable = {
  id: 'BM80030',
  name: 'When you are not in school, do you ever talk with your family or friends about music',
  title: 'whether they talked with their family or friends about music not for schoolwork',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const BM80034: ContextualVariable = {
  id: 'BM80034',
  name: 'Have you ever listened to a musical performance in a theater',
  title: 'whether they listened to a musical performance in a theater',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const SQ00701: ContextualVariable = {
  id: 'SQ00701',
  name: 'Is there a full-time specialist on your school staff available to teach music to eighth graders',
  title: 'whether there was a full-time specialist on their school staff available to teach music to eighth graders',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const SQ00202: ContextualVariable = {
  id: 'SQ00202',
  name: 'Does your district or state have a curriculum in music that your school is expected to follow',
  title: 'whether the district or state had a music curriculum that their school was expected to follow',
  selected: 0,
  categories: [
    'Yes',
    'No',
  ],
};

export const SQ00070: ContextualVariable = {
  id: 'SQ00070',
  name: 'Which best describes the space for the teaching and performing of music in your school',
  title: 'types of space for the teaching and performing of music in their school',
  selected: 1, // dedicated rooms and stage for teaching music
  categories: [
    'Music is not taught',
    'Room(s) dedicated to music teaching, and stage',
    'Room(s) dedicated to music teaching, no stage',
    'Stage but no room dedicated to music teaching',
    'Classrooms only',
    'Other',
  ],
};

/**
 * Retrieves all contextual variables for a given subject.
 */
export function contextualVariablesForSubject(subject: 'visual arts' | 'music'): ContextualVariable[] {
  if (subject === 'visual arts') {
    return [
      BV00003,
      BV00007,
      BV00008,
      BV00019,
      BV80022,
      BV80023,
      BV80024,
      BV80032,
      SQ00901,
      SQ00204,
      SQ00072,
    ];
  } else {
    return [
      BM00003,
      BM00010,
      BM80013,
      BM80015,
      BM80023,
      BM80024,
      BM80030,
      BM80034,
      SQ00701,
      SQ00202,
      SQ00070,
    ];
  }
}

/**
 * Returns the contextual variables for the current subject (as defined by the global `context` model).
 */
export function contextualVariables(): Variable[] {
  return contextualVariablesForSubject(context.subject);
}

/**
 * Looks up a contextual variable given its ID.
 */
export const contextualVariablesById: { [id: string]: ContextualVariable } = Object.create(null);

// Add variables dynamically so we only have to maintain one list
for (const subject of ['visual arts', 'music'] as ('visual arts' | 'music')[]) {
  for (const variable of contextualVariablesForSubject(subject)) {
    contextualVariablesById[variable.id] = variable;
  }
}

Object.freeze(contextualVariablesById);
