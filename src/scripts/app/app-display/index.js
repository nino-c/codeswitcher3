import 'angular';

import AppDisplayController from './app-display.controller';

let appDisplayModule = angular.module('app.appdisplay', []);
appDisplayModule.controller('AppDisplayController', AppDisplayController);

export default appDisplayModule.name;
