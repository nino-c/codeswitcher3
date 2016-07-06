import angular from 'angular';
import request from './request'
import authentication from './authentication';
import resolver from './resolver';
import {AppService, AppServiceMinimal, InstanceService, OrderedInstanceService, CodeModuleService} from './api';

import '../config'

export default angular.module('app.services', ['app.config'])
    .service('AppService', AppService)
    .service('AppServiceMinimal', AppServiceMinimal)
    .service('InstanceService', InstanceService)
    .service('OrderedInstanceService', OrderedInstanceService)
    .service('CodeModuleService', CodeModuleService)
    .service('authentication', authentication)
    .service('request', request)
    .service('resolver', resolver)
    .name;
