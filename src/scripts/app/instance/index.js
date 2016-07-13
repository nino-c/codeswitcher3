import 'angular';

import AppInstanceController from './instance.controller';

let instanceModule = angular.module('app.instance', []);
instanceModule.controller('AppInstanceController', AppInstanceController);

export default instanceModule.name;
