import angular from 'angular';

export default class Resolver {
    constructor() {
    

        this.$get = this.resolve;

        this.resolve.$inject = ['$q', 'authentication'];
    }

  resolve($q, authentication) {
    const deferred = $q.defer();
    if (authentication.isAuthorized()) {
      const promise = authentication.authorizeWithToken();
      promise.then(deferred.resolve, deferred.reject);
    } else {
      deferred.reject();
    }
    return deferred.promise;
  }
}
