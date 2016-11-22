export interface Variable {
  id: string;
  name: string;
  categories: string[];
}

export const SDRACE: Variable = {
  id: 'SDRACE',
  name: 'Race/ethnicity',
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
  categories: [
    'Male',
    'Female',
  ],
};

export const SLUNCH3: Variable = {
  id: 'SLUNCH3',
  name: 'NSLP Eligibility',
  categories: [
    'Eligible for National School Lunch Program (NSLP)',
    'Not eligible for National School Lunch Program (NSLP)',
  ],
};

export const PARED: Variable = {
  id: 'PARED',
  name: 'Parental education level',
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
  categories: [
    'Public',
    'Private',
  ],
};

export const CENSREG: Variable = {
  id: 'CENSREG',
  name: 'Region of the country',
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
  categories: [
    'Students with disabilities',
    'Not students with disabilities',
  ],
};

export const LEP: Variable = {
  id: 'LEP',
  name: 'Status as English language learners',
  categories: [
    'English language learners',
    'Not English language learners',
  ],
};

export const SLUNCH1: Variable = {
  id: 'SLUNCH1',
  name: 'NSLP eligibility',
  categories: [
    'Eligible for National School Lunch Program (NSLP)',
    'Not eligible for National School Lunch Program (NSLP)',
    'No information',
  ],
};

export const VariableList: {[k: string]: Variable} = {
  SDRACE: SDRACE,
  SRACE10: SRACE10,
  GENDER: GENDER,
  SLUNCH3: SLUNCH3,
  PARED: PARED,
  SCHTYP1: SCHTYP1,
  CENSREG: CENSREG,
  UTOL4: UTOL4,
  IEP: IEP,
  LEP: LEP,
  SLUNCH1: SLUNCH1,
};

export const VariableArray: Variable[] = [
  SDRACE,
  SRACE10,
  GENDER,
  PARED,
  SCHTYP1,
  CENSREG,
  UTOL4,
  IEP,
  LEP,
  SLUNCH1,
];
