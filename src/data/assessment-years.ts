type Dict<T> = {
  [key: number]: T[];
};

const years: Dict<number> = Object.create(null);
years[4] = [2009, 2015];
years[8] = [2009, 2011, 2015];
years[12] = [2009, 2015];

export function yearsForGrade(grade: number): number[] {
  return years[grade];
}

const targetYears: Dict<string> = Object.create(null);
for (const grade of [4, 8, 12]) {
  targetYears[grade] = years[grade].map(year => year + 'R3');
}

export function targetYearsForGrade(grade: number): string[] {
  return targetYears[grade];
}
