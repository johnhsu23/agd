type Dict<T> = {
  [key: number]: T[];
};

const years: Dict<number> = Object.create(null);
years[8] = [2008, 2016];

export function yearsForGrade(grade: number): number[] {
  return years[grade];
}

const targetYears: Dict<string> = Object.create(null);
for (const grade of [8]) {
  targetYears[grade] = years[grade].map(year => year + 'R3');
}

export function targetYearsForGrade(grade: number): string[] {
  return targetYears[grade];
}
