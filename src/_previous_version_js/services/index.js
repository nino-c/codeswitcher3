import angular from 'angular';
import request from './request'
import authentication from './authentication';
import resolver from './resolver';
import api from './api'

export default angular.module('services', [])
    .service('api', api)
    .service('authentication', authentication)
    .service('request', request)
    .service('resolver', resolver)
    .name;
