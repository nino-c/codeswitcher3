/*
*	The `MainController` handles everything to do with the
*	one and only <canvas> element, for bg and apps
*/

export default class MainController {

    constructor($rootScope, $scope, $location, $timeout, $window, $state, $mdDialog) {
		'ngInject';

        $rootScope.topScope = this;

		this.loading = false;
        this.testvar2 = 2;
		this.featuredApps = [[849,30], [901,30], [888,60], [121,7]];
		this.currentInstance = null;
        this.currentInstanceIndex = 0;
        this.currentInstanceId = this.featuredApps[0][0];

		this.canvasLoadConfig = {
			loadFromServer: true,
		};

        this.init = () => {
            console.log('content init', $state);
            if ($state.current.name != 'app.instance') {
                $timeout(() => {
                    this.setCurrentInstance( this.featuredApps[this.currentInstanceIndex][0] );
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

		this.toggleBottomBar = () => {
            $rootScope.showBottom = !$rootScope.showBottom;
			console.log('toggleBottomBar', $rootScope.showBottom);
        };

        this.nextApp = () => {
            this.currentInstanceIndex++;
            this.currentInstanceIndex = this.currentInstanceIndex % this.featuredApps.length;
            this.setCurrentInstance( this.featuredApps[this.currentInstanceIndex][0] );
        };

        this.showDetailPanel = () => {

        }

        this.viewSource = function(ev) {
            $mdDialog.show({
                locals: {
                    app: this.currentInstance.game,
                },
                templateUrl: 'views/view-source-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                controller: ViewSourceDialog,
                controllerAs: 'ctrl'
            });

            function ViewSourceDialog($scope, $mdDialog, app) {

                $scope.initialize = function() {

                    var lang = app.scriptType.split('text/').join('');
                    if (lang == 'paperscript') { lang = 'javascript'; }

                    $scope.cmOptions = {
                        lineWrapping: true,
                        lineNumbers: true,
                        indentWithTabs: true,
                        viewportMargin: Infinity,
                        mode: lang,
                        matchBrackets: true,
                        theme: "mdn-like",
                        gutters: ['codemirror-gutters']
                    }

                    $scope.codemirrorLoaded = (_editor) => {
                        _editor.setOption('mode', 'javascript');
                        console.log(_editor);

                    }

                    console.log('cmOpt', $scope.cmOptions);
                    $scope.app = app;
                }

                this.closeDialog = function() {
                    $mdDialog.hide();
                };
            }
        }

   }
}
