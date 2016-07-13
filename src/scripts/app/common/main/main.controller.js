/*
*	The `MainController` handles everything to do with the
*	one and only <canvas> element, for bg and apps
*/

//import {uiCodemirrorDirective} from 'angular-ui-codemirror';

export default class MainController {

    constructor($rootScope, $scope, $location, $timeout, $window,
        $state, $mdBottomSheet, $mdDialog, $mdSidenav, $log,
        authentication) {
		'ngInject';

        $rootScope.topScope = this;

		this.loading = false;
        this.testvar2 = 2;
		this.featuredApps = [[121,30], [849,30], [901,30], [888,60], [121,7]];
		this.currentInstance = null;
        this.currentInstanceIndex = 0;
        this.currentInstanceId = this.featuredApps[0][0];

		this.canvasLoadConfig = {
			loadFromServer: true,
		};

        this.init = () => {
            if ($state.current.name != 'app.instance') {
                $timeout(() => {
                    this.setCurrentInstance(
                        this.featuredApps[this.currentInstanceIndex][0]
                    );
                })
            }
        }

		this.setCurrentInstance = (id) => {
			if (id == this.currentInstanceId) {
				this.currentInstanceId = 0;
			}
			console.log('setCurrentInstance = ', id);
			this.currentInstanceId = id;
		};


        this.showBottomPanel = () => {
            $rootScope.showOnPanel({
                templateUrl: '/templates/common/bottom-panel/bottom-panel.html',
                controller: 'BottomPanelController',
                controllerAs: 'ctrl',
                clickOutsideToClose: true,
                escapeToClose: false,
                disableBackdrop: true,
            });
        }

        this.logout = () => {
            authentication.logout();
        }

        this.nextApp = () => {
            this.currentInstanceIndex++;
            this.currentInstanceIndex = this.currentInstanceIndex % this.featuredApps.length;
            this.setCurrentInstance( this.featuredApps[this.currentInstanceIndex][0] );
        };



        this.viewSource = function(ev) {
            $mdDialog.show({
                locals: {
                    app: this.currentInstance.game,
                },
                templateUrl: '/templates/views/view-source-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                controller: ViewSourceDialog,
                controllerAs: 'ctrl'
            });

            function ViewSourceDialog($scope, $mdDialog, app) {
                this.initialize = function() {

                    var lang = app.scriptType.split('text/').join('');
                    if (lang == 'paperscript') { lang = 'javascript'; }

                    this.cmOptions = {
                        lineWrapping: true,
                        lineNumbers: true,
                        indentWithTabs: true,
                        viewportMargin: Infinity,
                        disableInput: false,
                        mode: lang,
                        matchBrackets: true,
                        theme: "mdn-like",
                        gutters: ['codemirror-gutters']
                    }

                    this.codemirrorLoaded = (_editor) => {
                        _editor.setOption('mode', 'javascript');
                        console.log(_editor);

                    }

                    console.log('cmOpt', this.cmOptions);
                    this.app = app;
                }

                this.closeDialog = function() {
                    $mdDialog.hide();
                };
            }
        }

   }
}
