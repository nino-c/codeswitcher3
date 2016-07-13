import angular from 'angular';
//import config from './config';

export default class Request {
  constructor($http, config) {
    'ngInject';

    this.$http = $http;
    this.config = config;
    /* Attempt to retrieve the auth token from localStorage. */
    this.token = localStorage.getItem(this.config.AUTH_KEY);
  }

  _request(method, url, data) {
    const request = {
      method, data, url: `${this.config.ENDPOINT}${url}`
    };
    if (this.token) {
      request.headers = { Authorization: `Token ${this.token}` };
    }
    return this.$http(request);
  }

  /* Example usage: request.method('/api/auth/authorize/', {...}); */
  get(url, args)    { return this._request('GET', url, args);    }
  post(url, args)   { return this._request('POST', url, args);   }
  put(url, args)    { return this._request('PUT', url, args);    }
  delete(url, args) { return this._request('DELETE', url, args); }
}
