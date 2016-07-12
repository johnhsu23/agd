import * as $ from 'jquery';
import * as _ from 'underscore';
import * as Promise from 'bluebird';

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
    if (_.isArray(value)) {
      return value.join(',');
    } else {
      return '' + value;
    }
  });
}

export default function load<Params, Data>(params: Params): Promise<Data[]> {
  const options: JQueryAjaxSettings = {
    url: 'https://nrcpreview3.naepims.org/nrcdataservice/GetChartData.aspx',
    data: serialize(params),

    method: 'GET',
    dataType: 'json',
    xhrFields: {
      withCredentials: true,
    },
  };

  const request = $.ajax(options);

  return Promise.resolve(request)
    .then((response: Response<Data>) => {
      if (isSuccess(response)) {
        return response.result;
      } else {
        throw new Error(response.result);
      }
    });
}
