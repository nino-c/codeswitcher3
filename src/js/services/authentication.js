import angular from 'angular';
//import config from './config';

export default class Authentication {
  constructor($q, request, $location, $rootScope, config) {
      'ngInject';

    this.$q = $q;
    this.request = request;
    this.$location = $location;
    this.$rootScope = $rootScope;
    this.config = config;

    this.current = null;
    this.token = localStorage.getItem(this.config.AUTH_KEY);
  }

  hasAuthorized() {
    return !!this.current;
  }

  isAuthorized() {
    return !!this.token;
  }

  /* Makes a HTTP request to authorize with email/password. */
  authorize(email, password) {
    const deferred = this.$q.defer();
    if (!email || !password) {
      deferred.reject();
      return deferred.promise;
    }
    if (this.hasAuthorized()) {
      deferred.resolve(this.current);
      return deferred.promise;
    }

    this.request.post('/api/auth/authenticate/', { email, password }).then((res) => {
      this.current = res.data.user;
      this.token = res.data.token;
      this.$rootScope.userLoggedIn = true;

      localStorage.setItem(this.config.AUTH_KEY, this.token);
      deferred.resolve(this.current);
      this.$rootScope.user = this.current;
    }, deferred.reject);
    return deferred.promise;
  }

  /* Makes a HTTP request to authorize the user with just the token. */
  authorizeWithToken() {
    const deferred = this.$q.defer();
    if (this.hasAuthorized()) {
      deferred.resolve(this.current);
      return deferred.promise;
    }

    this.request.post('/api/auth/authenticate/', {}).then((res) => {
      this.current = res.data.user;
      deferred.resolve(this.current);
    }, deferred.reject);
    return deferred.promise;
  }

  logout() {
    if (!this.isAuthorized()) { return; }
    console.log('logout');
    localStorage.removeItem(this.config.AUTH_KEY);
    this.current = null;
    this.token = null;
    this.$rootScope.userLoggedIn = false;
    this.$rootScope.user = null;
    this.$location.path("/app/home");

  }
}
