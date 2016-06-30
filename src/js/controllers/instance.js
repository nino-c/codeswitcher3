//import config from '../services/config';

export default class AppInstanceController {

    constructor($rootScope, $window, $document, $scope, $interval, $location, $route,
        $resource, $mdToast, $timeout, $http, $mdDialog, $stateParams,
        api, authentication, config) {
        'ngInject';



        $scope.loading = true;
        $scope.timer = null;
        $scope.timeElapsed = 0;
        // $scope.seedTouched = false;
        // $scope.readyToSave = false;
        $scope.autosnapshot = false;
        $scope.source = null;
        $scope.seedcodelines = null;
        $scope.dialect = null;
        $scope.seedlings = null;

        $scope.currentCycleValue = null;
        $scope.varyParam = null;
        $scope.varyMin = 0;
        $scope.varyMax = 0;

        $scope.featureDisplayContent = '';
        $scope.featureDisplayCSS = {};



        $scope.initInstance = function() {
            console.log('init instance.js');
            $rootScope.viewscope = $scope;
            $rootScope.viewname = 'instance';
            $rootScope.topScope.canvasLoadConfig = {
                loadFromServer: true,
            };
            $rootScope.topScope.setCurrentInstance($stateParams.id);
        };

        $scope.cleanSeed = function(seed) {
            return _.mapObject(seed, function(s) {
                if (s.type == "number") {
                    s.value = parseInt(s.value);
                }
                return s;
            });
        }

        $scope.parseSeedVector = function(setToFalse) {
            /*
                FROM instance.seed:String
                TO _seed:Object (with int conversion)
                TO seedlings:Array
            */
            $scope._seed = $scope.cleanSeed(JSON.parse($scope.instance.seed));
            $scope.seedlings = _.pairs($scope._seed);
            console.log('parseSeedVector, seedlings = ', $scope.seedlings);

        };

        $scope.updateSeed = function() {
            /*
                FROM seedlings:Array
                TO _seed:Object
            */
            console.log('updateSeed', $scope.seedlings);
            $scope._seed = $scope.cleanSeed(_.object($scope.seedlings));
            $scope.instance.seed = JSON.stringify($scope._seed);
        }

        $scope.execute = function(options) {
            $scope.appstart = new Date();
            $scope.timer = $interval(function() {
                $scope.timeElapsed = ((new Date()).getTime() - $scope.appstart.getTime()) / 1000;
            }, 1000);

            $scope.parseSeedVector();

            if (!options.loadFromServer) {
                options.instance = $scope.instance;
            }
            $rootScope.topScope.canvasLoadConfig = options;
            $rootScope.topScope.setCurrentInstance($scope.instance.id);
        };

        $scope.renderingDone = function() {

            console.log('renderingDone');

            if ($scope.autosnapshot) {
                $scope.snapshot();
                $scope.autosnapshot = false;
            }

            if ($scope.currentCycleValue != null) {
                $timeout(function() {
                    $scope.doCycle();
                }, 1500)
            }
        }
        $window.renderingDone = $scope.renderingDone;

        $scope.cycleParam = function(param, min, max) {

            $scope.varyParam = param;
            $scope.currentCycleValue = min;
            $scope.varyMin = min;
            $scope.varyMax = max;

            console.log('---------cycle', $scope.varyParam, $scope.varyMin, $scope.varyMax);

            if (typeof $scope._seed[$scope.varyParam] == 'object' && $scope._seed[$scope.varyParam].value) {
                $scope._seed[$scope.varyParam].value = $scope.currentCycleValue;
            } else {
                $scope._seed[$scope.varyParam] = $scope.currentCycleValue;
            }

            $scope.updateInstance({
                autosnapshot: true
            });
        }

        $scope.doCycle = function() {

            $scope.currentCycleValue++;

            if ($scope.currentCycleValue > $scope.varyMax)  {
                $scope.currentCycleValue = null;
                return;
            }

            if (typeof $scope._seed[$scope.varyParam] == 'object' && $scope._seed[$scope.varyParam].value) {
                $scope._seed[$scope.varyParam].value = $scope.currentCycleValue;
            } else {
                $scope._seed[$scope.varyParam] = $scope.currentCycleValue;
            }
            console.log('-------doCycle', $scope._seed);
            //$scope.parseSeedList();
            $scope.updateInstance({
                autosnapshot: true
            });

        };


        $scope.featureDisplay = function(content, css) {

            if (!css)
                css = {};
            if (typeof content == 'string')
                content = [content];

            $scope.featureDisplayContent = content;
            $scope.featureDisplayCSS = _.reduce(
                _.mapObject(css, function(val, key) {
                    return key+':'+val+';';
                }), function(a,b) { return a+b; }, '');

            $timeout($scope.refreshMathJax);

        };
        $window.featureDisplay = $scope.featureDisplay;


        $scope.updateInstance = function(options) {
            console.log('updateInstance', options);
            if (typeof options != 'object')
                options = {autosnapshot:Boolean(options)};

            $scope.seedlings = options.seedlings ? options.seedlings : $scope.seedlings;
            $scope.autosnapshot = options.autosnapshot ? true : false;
            $scope.loading = true;

            $scope.updateSeed();
            $scope.parseSeedVector();

            if ($scope.userLoggedIn) {
                console.log('upInst, inside');
                var req = {
                    method: 'POST',
                    data: $scope._seed,
                    url: config.ENDPOINT + '/game/app-instantiate/' + $scope.instance.game.id + '/',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }

                $http(req).then(function successCallback(response) {

                    console.log(response);

                    if (response.data.id) {

                        $scope.instance.id = response.data.id;
                        $stateParams.id = response.data.id;

                        $scope.clearCanvas();
                        $scope.clearPaperCanvas();
                        $scope.loading = true;
                        $scope.timeElapsed = 0;
                        $scope.seedTouched = false;
                        $scope.readyToSave = false;

                        if (response.data.alreadyExists) {
                            $rootScope.toast("Seed-vector exists already.");
                            $scope.autosnapshot = false;
                        } else {
                            $rootScope.toast("Saved as new instance.");
                        }

                        var snapshot = response.data.alreadyExists ? false : true;
                        $scope.execute({
                            loadFromServer:true
                        });

                    }

                }, function errorCallback(response) {
                    console.log('error', response)
                });


            } else {

                $scope.clearCanvas();
                $scope.clearPaperCanvas();
                $scope.loading = true;
                $scope.timeElapsed = 0;
                //$scope.seedTouched = false;
                //$scope.readyToSave = false;
                $scope.execute({
                    loadFromServer:false
                });
            }

        };





        $scope.editSeed = function($event) {

            console.log('editseed');
            //$scope.seedlings = _.pairs($scope._seed);
            $scope.parseSeedVector();

            $mdDialog.show({
                bindToController: true,
                targetEvent: $event,
                //require: ['^mdRadioGroup'],
                locals: {
                    seedlings: $scope.seedlings,
                    parentScope: $scope
                },
                //preserveScope: true,
                templateUrl: 'views/seed-editor-dialog.html',
                parent: angular.element(document.body),
                controller: function(scope, $mdDialog, seedlings, parentScope, $timeout) {

                    scope.seedlings = seedlings;
                    scope.varyParam = null;
                    scope.varyMin = 0;
                    scope.varyMax = 0;
                    scope.seedTouched = false;
                    scope.readyToSave = false;

                    scope.initializeSeedEditor = function() {
                        console.log('DialogController init');
                        console.log(scope.seedlings);
                        $timeout(() => {
                            $rootScope.refreshMathJax();
                        })
                    };

                    scope.closeDialog = function() {
                        $mdDialog.hide();
                    };

                    scope.seedChange = function() {
                        scope.seedTouched = true;
                        scope.readyToSave = true;
                        console.log('seedChanged', scope.seedlings)
                    };

                    scope.changeVaryParam = function() {
                        console.log('changeVaryParam');
                    }

                    scope._updateInstance = function() {
                        console.log('_updateInstance :: inside DialogController');
                        console.log('varyParam', scope.varyParam);
                        //scope.parseSeedList();
                        //scope.updateSeed();

                        parentScope.seedlings = scope.seedlings;


                        if (scope.varyParam != null) {
                            parentScope.cycleParam(scope.varyParam, scope.varyMin, scope.varyMax);
                        } else {
                            console.log('calling upIns from inside DC');
                            parentScope.updateInstance({
                                autosnapshot: true,
                                seedlings: scope.seedlings
                            });
                        }
                        $mdDialog.hide();
                    }

                }
            });


        }


        $scope.snapshot = function() {

            if (!authentication.isAuthorized()) { return; }

            var Canvas = $scope.dialect.indexOf('paperscript') > -1 ?
                document.getElementById("paperscript-canvas") : document.getElementById("big-canvas");

            if (window._renderer) {
                var snapshot = window._renderer.domElement.toDataURL("image/png");
            } else {
                var snapshot = Canvas.toDataURL("image/png");
            }
            var url = "/game/snapshot/";
            $.post(url, {
                    instance: $scope.instance.id,
                    time: $scope.timeElapsed,
                    image: snapshot
                },
                function(data) {
                    $rootScope.toast("Snapshot saved.")
                    console.log(data);
                }
            );
        };
        $window.snapshot = $scope.snapshot;

        $scope.clearCanvas = function() {
            try {
                var _canvas = document.getElementById('big-canvas');
                if (_canvas) {
                    var context = _canvas.getContext('2d')
                    if (context) {
                        context.fillStyle = '#ffffff';
                        context.fillRect(0,0,_canvas.width, _canvas.height);
                        context.clearRect(0,0,_canvas.width, _canvas.height);
                        console.log('clear canvas')
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };

        $scope.clearPaperCanvas = function() {

            $scope.source = null;
            $scope.seedcodelines = null;
            //$scope.dialect = null;

            try {
                // with (paper) {
                    if (paper.project) {
                        paper.project.layers.forEach(function(lay) {
                            lay.removeChildren();
                            lay.remove();
                        });
                        paper.project.clear();
                    }
                // }
            } catch (e) { console.log('clearPaperCanvas error', e); }
        };

        // $scope.$destroy = function() {
        //     console.log('scope destroy instance.js');
        //
        //     // try to delete all vars in scope of previously eval()-ed app
        //     try {
        //         window.appdestroy();
        //     } catch (e) {
        //         console.log('no appdestroy()', e);
        //     };
        //
        //     // var _canvas = document.getElementById('big-canvas');
        //     // _canvas.parentNode.remove(_canvas);
        // };

        // $scope.$on("$destroy", function() {
        //     console.log('destroy1');
        //     $scope._destroy();
        //});

        // $scope.$destroy = function() {
        //     console.log('destroy2');
        //     if ($scope.gameFunction) {
        //         delete $scope.gameFunction;
        //         console.log('deleting gameFunction')

        //     }
        // }

    }

}
