import 'angular';
import './instance-canvas.scss';


import InstanceCanvasController from './instance-canvas.controller';
import {AppInstanceCanvas, PaperscriptCanvas, Colorbox,
    SeedList, SeedListValue} from './instance-canvas.directive';

let instanceCanvasModule = angular.module('app.instancecanvas', [])
    .controller('InstanceCanvasController', InstanceCanvasController)
    .directive('appInstanceCanvas', AppInstanceCanvas)
    .directive('paperscriptCanvas', PaperscriptCanvas)
    .directive('colorbox', Colorbox)
    .directive('seedList', SeedList)
    .directive('seedListValue', SeedListValue);

export default instanceCanvasModule.name;
