type Acl = {
  label: string;
  value: number;
}

type Dict = {
  [grade: number]: Acl[];
};

const acls: Dict = Object.create(null);
/*
 * The ordering of these may seem strange, but it's intended to help with the
 * focus order when the user tabs through the page.
 */
acls[4] = [
  {
    label: 'Advanced',
    value: 224,
  },
  {
    label: 'Proficient',
    value: 167,
  },
  {
    label: 'Basic',
    value: 131,
  },
];

acls[8] = [
  {
    label: 'Advanced',
    value: 215,
  },
  {
    label: 'Proficient',
    value: 170,
  },
  {
    label: 'Basic',
    value: 141,
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
