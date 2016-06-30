import 'angular';
import 'angular-ui-router';

import './main.scss';
import './header.scss';

import MainController from './main.controller';
import PanelController from './panel.controller';
import ToolbarController from './toolbar.controller';
import HomeController from './home.controller';

let appMainModule = angular.module('app.common', [])
    .controller('MainController', MainController)
    .controller('HomeController', HomeController)
    .controller('PanelController', PanelController)
    .controller('ToolbarController', ToolbarController);

export default appMainModule.name;
