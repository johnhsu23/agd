export interface Variable {
  /**
   * The ID of this variable. Used for lookup in the NDE.
   */
  readonly id: string;

  /**
   * The display name of this variable.
   *
   * This is used when presenting a variable to the user, such as in a Selectability dropdown or as the heading in an
   * accordion.
   */
  readonly name: string;

  /**
   * The name of this variable when used in a figure title.
   *
   * Whereas the `name` property stands alone by itself, the title is meant to flow in line with other text, such as
   * in this example:
   *
   * ```
   * return `Percentage of eighth-grade students, by ${variable.title}`;
   * ```
   */
  readonly title: string;

  /**
   * A list of this variable's categories.
   */
  readonly categories: string[];
}

export const SDRACE: Variable = {
  id: 'SDRACE',
  name: 'Race/ethnicity',
  title: 'race/ethnicity',
  categories: [
    'White',
    'Black',
    'Hispanic',
    'Asian/Pacific Islander',
    'American Indian/Alaska Native',
    'Two or More Races',
  ],
};

export const SRACE10: Variable = {
  id: 'SRACE10',
  name: 'Race/ethnicity (SRACE10)',
  title: 'race/ethnicity',
  categories: [
    'White',
    'Black',
    'Hispanic',
    'Asian',
    'American Indian/Alaska Native',
    'Native Hawaiian/Other Pacific Islander',
    'Two or More Races',
  ],
};

export const GENDER: Variable = {
  id: 'GENDER',
  name: 'Gender',
  title: 'gender',
  categories: [
    'Male',
    'Female',
  ],
};

export const SLUNCH3: Variable = {
  id: 'SLUNCH3',
  name: 'NSLP Eligibility',
  title: 'eligibility for the National School Lunch Program (NSLP)',
  categories: [
    'Eligible for National School Lunch Program (NSLP)',
    'Not eligible for National School Lunch Program (NSLP)',
    'Information not available',
  ],
};

export const PARED: Variable = {
  id: 'PARED',
  name: 'Parental education level',
  title: 'highest level of parental education',
  categories: [
    'Did not finish high school',
    'Graduated from high school',
    'Some education after high school',
    'Graduated from college',
    'Unknown',
  ],
};

export const SCHTYP1: Variable = {
  id: 'SCHTYP1',
  name: 'Type of school',
  title: 'type of school',
  categories: [
    'Public',
    'Private: Overall',
    'Private: Catholic',
  ],
};

export const SCHTYPE: Variable = {
  id: 'SCHTYPE',
  name: 'Type of school',
  title: 'type of school',
  categories: [
    'Public',
    'Private: Overall',
    'Private: Catholic',
  ],
};

export const SCHTYP2: Variable = {
  id: 'SCHTYP2',
  name: 'Type of school',
  title: 'type of school',
  categories: [
    'Public',
    'Private: Overall',
    'Private: Catholic',
  ],
};

export const CENSREG: Variable = {
  id: 'CENSREG',
  name: 'Region of the country',
  title: 'region of the country',
  categories: [
    'Northeast',
    'Midwest',
    'South',
    'West',
  ],
};

export const UTOL4: Variable = {
  id: 'UTOL4',
  name: 'School location',
  title: 'school location',
  categories: [
    'City',
    'Suburban',
    'Town',
    'Rural',
  ],
};

export const IEP: Variable = {
  id: 'IEP',
  name: 'Status as students with disabilities',
  title: 'status as students with disabilities',
  categories: [
    'Students with disabilities',
    'Not students with disabilities',
  ],
};

export const LEP: Variable = {
  id: 'LEP',
  name: 'Status as English language learners',
  title: 'status as English language learners',
  categories: [
    'English language learners',
    'Not English language learners',
  ],
};

export const SLUNCH1: Variable = {
  id: 'SLUNCH1',
  name: 'NSLP eligibility',
  title: 'eligibility for the National School Lunch Program (NSLP)',
  categories: [
    'Eligible for National School Lunch Program (NSLP)',
    'Not eligible for National School Lunch Program (NSLP)',
    'Information not available',
  ],
};

export const studentGroupsById: {[k: string]: Variable} = {
  SDRACE: SDRACE,
  SRACE10: SRACE10,
  GENDER: GENDER,
  PARED: PARED,
  SCHTYPE: SCHTYPE,
  SCHTYP1: SCHTYP1,
  SCHTYP2: SCHTYP2,
  CENSREG: CENSREG,
  UTOL4: UTOL4,
  IEP: IEP,
  LEP: LEP,
  SLUNCH1: SLUNCH1,
  SLUNCH3: SLUNCH3,
};

export const studentGroups: Variable[] = [
  SDRACE,
  GENDER,
  SLUNCH3,
  PARED,
  SCHTYPE,
  CENSREG,
  UTOL4,
  IEP,
  LEP,
];
