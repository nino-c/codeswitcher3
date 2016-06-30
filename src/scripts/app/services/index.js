import angular from 'angular';
import request from './request'
import authentication from './authentication';
import resolver from './resolver';
import api from './api'

import '../config'

export default angular.module('app.services', ['app.config'])
    .service('api', api)
    .service('authentication', authentication)
    .service('request', request)
    .service('resolver', resolver)
    .name;
