type Acl = {
  label: string;
  value: number;
}

type Dict = {
  [grade: number]: Acl[];
};

const acls: Dict = Object.create(null);

acls[4] = [
  {
    label: 'Basic',
    value: 131,
  },
  {
    label: 'Proficient',
    value: 167,
  },
  {
    label: 'Advanced',
    value: 224,
  },
];

acls[8] = [
  {
    label: 'Basic',
    value: 141,
  },
  {
    label: 'Proficient',
    value: 170,
  },
  {
    label: 'Advanced',
    value: 215,
  },
];

acls[12] = [
  {
    label: 'Basic',
    value: 142,
  },
  {
    label: 'Proficient',
    value: 179,
  },
  {
    label: 'Advanced',
    value: 222,
  },
];

export default acls;
