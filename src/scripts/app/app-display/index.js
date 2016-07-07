import 'angular';

import AppDisplayController from './app-display.controller';
import {BnLazySrc} from './lazy-image.directive';
import './app-display.scss';

let appDisplayModule = angular.module('app.appdisplay', []);
appDisplayModule.controller('AppDisplayController', AppDisplayController);
appDisplayModule.directive('bnLazySrc', BnLazySrc);


export default appDisplayModule.name;
