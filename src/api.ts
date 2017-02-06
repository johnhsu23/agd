import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Promise from 'bluebird';

import * as env from 'env';

interface SuccessResponse<T> {
  status: number;
  result: T[];
}

interface FailedResponse {
  status: number;
  result: string;
}

type Response<T> = SuccessResponse<T> | FailedResponse;

function isSuccess<T>(response: Response<T>): response is SuccessResponse<T> {
  return response.status === 200;
}

function serialize(params: Object): { [key: string]: string } {
  return _.mapObject(params, value => {
    if (Array.isArray(value)) {
      return value.join(',');
    } else {
      return '' + value;
    }
  });
}

export default function load<Params, Data>(params: Params): Promise<Data[]> {
  const options: JQueryAjaxSettings = {
    url: env.api,
    data: serialize(params),

    method: 'GET',
    dataType: 'json',
  };

  if (env.cors) {
    options.xhrFields = {
      withCredentials: true,
    };
  }

  const request = $.ajax(options);

  return Promise.resolve(request)
    .catch((xhr: JQueryXHR) => {
      throw new Error(`AJAX request failed: ${xhr.status} ${xhr.statusText}`);
    })
    .then((response: Response<Data>) => {
      if (isSuccess(response)) {
        return response.result;
      } else {
        throw new Error(response.result);
      }
    });
}

function loadAll<Params, Data>(params: Params[]): Promise<Data[]> {
  return Promise.all<Data[]>(params.map(load))
    .then(rows => {
      return [].concat.apply([], rows) as Data[];
    });
}

export {
  load,
  loadAll,
}
