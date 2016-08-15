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
    'Asian',
    'Native Hawaiian/Other Pacific Islander',
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
