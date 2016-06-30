import 'angular';
import 'angular-ui-router';

import mainComponent from './main.component';

let appMainModule = angular.module('app.main', ['ui.router'])
    .component('appMain', mainComponent)
export default appMainModule.name;
