import HomeController from './home-page'
import BottomBarController from './bottom-bar-controller'
import ToolbarController from './toolbar-controller'
import ContentController from './content-controller'
import AppListController from './app-list-controller'
import AppDisplayController from './app-display'
import AppInstanceController from './instance'
import AppEditorController from './app-editor'
import PanelController from './panel-controller'

export default angular.module('controllers', [])
.controller('HomeController', HomeController)
.controller('ContentController', ContentController)
.controller('AppListController', AppListController)
.controller('BottomBarController', BottomBarController)
.controller('ToolbarController', ToolbarController)
.controller('AppDisplayController', AppDisplayController)
.controller('AppInstanceController', AppInstanceController)
.controller('AppEditorController', AppEditorController)
.controller('PanelController', PanelController);
