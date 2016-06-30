import 'angular';
import './instance-canvas.scss';


import InstanceCanvasController from './instance-canvas.controller';
import AppInstanceCanvas from './instance-canvas.directive'

let instanceCanvasModule = angular.module('app.instancecanvas', [])
    .controller('InstanceCanvasController', InstanceCanvasController)
    .directive('appInstanceCanvas', AppInstanceCanvas);

export default instanceCanvasModule.name;
