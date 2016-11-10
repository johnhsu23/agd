import {history} from 'backbone';

type getPath = {
  subject: string,
  fragment: string,
  location: string,
}

export default function getPath(): getPath {
  let location = window.location.hash;
  const portions = history.getFragment().split('/');

  if (portions[1]) {
    if (portions[1].indexOf('#') > -1) {
      const subPage = portions[1].split('#');
      portions[1] = subPage[0];
      location = '#' + portions[0] + '/' + portions[1];
    }
  }

  return {
    subject: portions[0],
    fragment: portions[1],
    location: location,
  };
}
