import 'angular';
import 'angular-ui-router';

import './main/main.scss';
import './toolbar/toolbar.scss';
import './bottom-panel/bottom-panel.scss';

import MainController from './main/main.controller';
import PanelController from './panel/panel.controller';
import ToolbarController from './toolbar/toolbar.controller';
import BottomPanelController from './bottom-panel/bottom-panel.controller';
import HomeController from './home/home.controller';


let appMainModule = angular.module('app.common', [])
    .config(($mdIconProvider) => {
        $mdIconProvider
            .icon('apps', 'assets/img/icons/ic_apps_black_24px.svg', 24)
            .icon('remove_red_eye_black', 'assets/img/icons/ic_remove_red_eye_black_24px.svg', 24)
            .icon('photo_camera', 'assets/img/icons/ic_photo_camera_black_24px.svg', 24)
            .icon('arrow_forward', 'assets/img/icons/ic_arrow_forward_black_24px.svg', 24)
            .icon('settings', 'assets/img/icons/ic_settings_black_24px.svg', 24)
            .icon('menu', 'assets/img/icons/menu.svg', 24)
            .icon('code', 'assets/img/icons/ic_code_black_24px.svg', 24);
    })
    .controller('MainController', MainController)
    .controller('HomeController', HomeController)
    .controller('PanelController', PanelController)
    .controller('BottomPanelController', BottomPanelController)
    .controller('ToolbarController', ToolbarController);

export default appMainModule.name;
