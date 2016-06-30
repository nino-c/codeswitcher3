import 'angular';

let config = angular.module('app.config', []);
config.factory('config', $window => {
    'ngInject';

    return {
        ENDPOINT: `http://${$window.location.hostname}:8000`,
        AUTH_KEY: 'auth'
    }
})

export default config.name;
