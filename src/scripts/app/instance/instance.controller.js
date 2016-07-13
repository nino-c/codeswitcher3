//import config from '../services/config';

export default class AppInstanceController {

    constructor($rootScope, $window, $document, $scope, $interval, $location,
        $resource, $mdToast, $timeout, $http, $mdDialog, $stateParams,
        authentication, config, AppService, InstanceService) {
        'ngInject';



        this.loading = true;
        this.timer = null;
        this.timeElapsed = 0;
        // this.seedTouched = false;
        // this.readyToSave = false;
        this.autosnapshot = false;
        this.source = null;
        this.seedcodelines = null;
        this.dialect = null;
        this.seedlings = null;

        this.currentCycleValue = null;
        this.varyParam = null;
        this.varyMin = 0;
        this.varyMax = 0;

        this.featureDisplayContent = '';
        this.featureDisplayCSS = {};

        this.initInstance = function() {
            console.log('init instance.js');
            // $rootScope.viewscope = this;
            // $rootScope.viewname = 'instance';
            // $rootScope.topScope.canvasLoadConfig = {
            //     loadFromServer: true,
            // };
            // $rootScope.topScope.setCurrentInstance($stateParams.id);
            console.log('$stateParams', $stateParams);
            this.instanceId = $stateParams.id;
            this.app = AppService.get({id:$stateParams.app});
            this.instance = InstanceService.get({id:$stateParams.id});
        };

        this.cleanSeed = function(seed) {
            return _.mapObject(seed, function(s) {
                if (s.type == "number") {
                    s.value = parseInt(s.value);
                }
                return s;
            });
        }

        this.parseSeedVector = function(setToFalse) {
            /*
                FROM instance.seed:String
                TO _seed:Object (with int conversion)
                TO seedlings:Array
            */
            this._seed = this.cleanSeed(JSON.parse(this.instance.seed));
            this.seedlings = _.pairs(this._seed);
            console.log('parseSeedVector, seedlings = ', this.seedlings);

        };

        this.updateSeed = function() {
            /*
                FROM seedlings:Array
                TO _seed:Object
            */
            console.log('updateSeed', this.seedlings);
            this._seed = this.cleanSeed(_.object(this.seedlings));
            this.instance.seed = JSON.stringify(this._seed);
        }

        this.execute = function(options) {
            this.appstart = new Date();
            this.timer = $interval(function() {
                this.timeElapsed = ((new Date()).getTime() - this.appstart.getTime()) / 1000;
            }, 1000);

            this.parseSeedVector();

            if (!options.loadFromServer) {
                options.instance = this.instance;
            }
            $rootScope.topScope.canvasLoadConfig = options;
            $rootScope.topScope.setCurrentInstance(this.instance.id);
        };

        this.renderingDone = function() {

            console.log('renderingDone');

            if (this.autosnapshot) {
                this.snapshot();
                this.autosnapshot = false;
            }

            if (this.currentCycleValue != null) {
                $timeout(function() {
                    this.doCycle();
                }, 1500)
            }
        }
        $window.renderingDone = this.renderingDone;

        this.cycleParam = function(param, min, max) {

            this.varyParam = param;
            this.currentCycleValue = min;
            this.varyMin = min;
            this.varyMax = max;

            console.log('---------cycle', this.varyParam, this.varyMin, this.varyMax);

            if (typeof this._seed[this.varyParam] == 'object' && this._seed[this.varyParam].value) {
                this._seed[this.varyParam].value = this.currentCycleValue;
            } else {
                this._seed[this.varyParam] = this.currentCycleValue;
            }

            this.updateInstance({
                autosnapshot: true
            });
        }

        this.doCycle = function() {

            this.currentCycleValue++;

            if (this.currentCycleValue > this.varyMax) {
                this.currentCycleValue = null;
                return;
            }

            if (typeof this._seed[this.varyParam] == 'object' && this._seed[this.varyParam].value) {
                this._seed[this.varyParam].value = this.currentCycleValue;
            } else {
                this._seed[this.varyParam] = this.currentCycleValue;
            }
            console.log('-------doCycle', this._seed);
            //this.parseSeedList();
            this.updateInstance({
                autosnapshot: true
            });

        };


        this.featureDisplay = function(content, css) {

            if (!css)
                css = {};
            if (typeof content == 'string')
                content = [content];

            this.featureDisplayContent = content;
            this.featureDisplayCSS = _.reduce(
                _.mapObject(css, function(val, key) {
                    return key + ':' + val + ';';
                }),
                function(a, b) {
                    return a + b;
                }, '');

            $timeout(this.refreshMathJax);

        };
        $window.featureDisplay = this.featureDisplay;


        this.updateInstance = function(options) {
            console.log('updateInstance', options);
            if (typeof options != 'object')
                options = {
                    autosnapshot: Boolean(options)
                };

            this.seedlings = options.seedlings ? options.seedlings : this.seedlings;
            this.autosnapshot = options.autosnapshot ? true : false;
            this.loading = true;

            this.updateSeed();
            this.parseSeedVector();

            if (this.userLoggedIn) {
                console.log('upInst, inside');
                var req = {
                    method: 'POST',
                    data: this._seed,
                    url: config.ENDPOINT + '/game/app-instantiate/' + this.instance.game.id + '/',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }

                $http(req).then(function successCallback(response) {

                    console.log(response);

                    if (response.data.id) {

                        this.instance.id = response.data.id;
                        $stateParams.id = response.data.id;

                        this.clearCanvas();
                        this.clearPaperCanvas();
                        this.loading = true;
                        this.timeElapsed = 0;
                        this.seedTouched = false;
                        this.readyToSave = false;

                        if (response.data.alreadyExists) {
                            $rootScope.toast("Seed-vector exists already.");
                            this.autosnapshot = false;
                        } else {
                            $rootScope.toast("Saved as new instance.");
                        }

                        var snapshot = response.data.alreadyExists ? false : true;
                        this.execute({
                            loadFromServer: true
                        });

                    }

                }, function errorCallback(response) {
                    console.log('error', response)
                });


            } else {

                this.clearCanvas();
                this.clearPaperCanvas();
                this.loading = true;
                this.timeElapsed = 0;
                //this.seedTouched = false;
                //this.readyToSave = false;
                this.execute({
                    loadFromServer: false
                });
            }

        };





        this.editSeed = function($event) {

            console.log('editseed');
            //this.seedlings = _.pairs(this._seed);
            this.parseSeedVector();

            $mdDialog.show({
                bindToController: true,
                targetEvent: $event,
                //require: ['^mdRadioGroup'],
                locals: {
                    seedlings: this.seedlings,
                    parentScope: this
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


        this.snapshot = function() {

            if (!authentication.isAuthorized()) {
                return;
            }

            var Canvas = this.dialect.indexOf('paperscript') > -1 ?
                document.getElementById("paperscript-canvas") : document.getElementById("big-canvas");

            if (window._renderer) {
                var snapshot = window._renderer.domElement.toDataURL("image/png");
            } else {
                var snapshot = Canvas.toDataURL("image/png");
            }
            var url = "/game/snapshot/";
            $.post(url, {
                    instance: this.instance.id,
                    time: this.timeElapsed,
                    image: snapshot
                },
                function(data) {
                    $rootScope.toast("Snapshot saved.")
                    console.log(data);
                }
            );
        };
        $window.snapshot = this.snapshot;

        this.clearCanvas = function() {
            try {
                var _canvas = document.getElementById('big-canvas');
                if (_canvas) {
                    var context = _canvas.getContext('2d')
                    if (context) {
                        context.fillStyle = '#ffffff';
                        context.fillRect(0, 0, _canvas.width, _canvas.height);
                        context.clearRect(0, 0, _canvas.width, _canvas.height);
                        console.log('clear canvas')
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };

        this.clearPaperCanvas = function() {

            this.source = null;
            this.seedcodelines = null;
            //this.dialect = null;

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
            } catch (e) {
                console.log('clearPaperCanvas error', e);
            }
        };

        // this.$destroy = function() {
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

        // this.$on("$destroy", function() {
        //     console.log('destroy1');
        //     this._destroy();
        //});

        // this.$destroy = function() {
        //     console.log('destroy2');
        //     if (this.gameFunction) {
        //         delete this.gameFunction;
        //         console.log('deleting gameFunction')

        //     }
        // }

    }

}
