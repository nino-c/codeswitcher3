import 'angular';
import InstanceToolsController from './instance-tools-controller';

let instanceTools = {
    restrict: 'E',
    bindings: {},
    templateUrl: 'templates/instance-tools/instance-tools.html',
    controller: InstanceToolsController,
    controllerAs: 'ctrl'
}

let instanceToolsModule = angular.module('app.instancetools', [])
    .component('instanceTools', instanceTools);
export default instanceToolsModule.name;
