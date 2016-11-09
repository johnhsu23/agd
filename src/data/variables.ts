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
