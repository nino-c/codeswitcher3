import 'angular'
import 'angular-material';
import 'angular-ui-router';
import 'angular-route';
import 'angular-resource';
import 'angular-cookies';
import 'angular-bootstrap';
import 'angular-animate';
import 'angular-sanitize';


//import {ionic} from './ionic-angular/ionic';
//import {IonicModule} from './ionic-angular/ionic-angular';

// module was altered -- just added dependency injection
import './ui.codemirror/ui.codemirror';

import './config';
import './config/templates';
import './services';
import './filters';
import './common';
import './app-list';
import './app-editor';
//import './instance-information';
import './app-display';
import './instance';
import './instance-tools';
import './instance-canvas'
import './login';

import 'numeric';
import jQuery from 'jquery';
import {_} from 'underscore';

import Complex from 'complex';
import CodeMirror from 'codemirror';
//import CoffeeScript from 'coffee-script';
//import MathJax from 'mathjax';
import math from 'mathjs';



window.app = angular.module('app', [
        //'ionic',
        'ngAnimate',
        'ngMaterial',
        'ngResource',
        'ngCookies',
        'ngSanitize',
        'ui.router',
        'ui.codemirror',

        'app.common',
        'app.services',
        'app.config',
        'app.templates',
        'app.services',
        'app.filters',
        'app.login',
        'app.applist',
        //'app.instanceinformation',
        'app.appdisplay',
        'app.editor',
        'app.instancecanvas',
        'app.instance'

    ]).value('ui.config', {

        codemirror: {
            lineWrapping: true,
            lineNumbers: true,
            indentWithTabs: true,
            viewportMargin: Infinity,
            mode: 'javascript',
            matchBrackets: true,
            theme: "mdn-like"
        }

    }).config(function($mdThemingProvider, $stateProvider, $urlRouterProvider,
        $resourceProvider, $mdIconProvider) {

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('orange');

        $mdIconProvider.viewBoxSize = 24;
        $urlRouterProvider.otherwise('/app/home')

        $stateProvider.state('userapp', {
                url: '/userapp/{scriptname:[a-zA-Z\-]+}',
                views: {
                    '': {
                        templateUrl: '/templates/views/userapp.html',
                        controller: function($scope, $stateParams) {
                            'ngInject';

                            this.source = `/assets/userapps/${$stateParams.scriptname}.js`;
                        },
                        controllerAs: '$ctrl'
                    }
                }
            }).state('app', {
                url: '/app',
                abstract: true,
                views: {
                    '': {
                        controller: 'MainController',
                        controllerAs: '$ctrl',
                        templateUrl: '/templates/common/main/main.html'
                    },
                    'toolbar@app': {
                        controller: 'ToolbarController',
                        controllerAs: 'ctrl',
                        templateUrl: '/templates/common/toolbar/toolbar.html'
                    }
                    // 'panel@app': {
                    //     templateUrl: '/templates/common/panel/panel.html',
                    //     controller: 'PanelController',
                    //     controllerAs: 'ctrl'
                    // }
                }
            })
            .state('app.home', {
                url: '/home',
                views: {
                    '': {
                        templateUrl: '/templates/common/home/home.html',
                        controller: 'HomeController',
                        controllerAs: 'ctrl'
                    }
                    // 'bottom-panel@app': {
                    //     templateUrl: '/templates/common/bottom-panel/bottom-panel.html',
                    //     controller: 'BottomPanelController',
                    //     controllerAs: 'ctrl'
                    // }
                    // 'floating-panel@app': {
                    //     templateUrl: '/templates/instance-information/instance-information.html',
                    //     controller: 'InstanceInformationController',
                    //     controllerAs: 'ctrl'
                    // }
                    // 'panel-content@app': {
                    //     templateUrl: '/templates/views/panel.home.html'
                    // },
                    // 'panel-buttons@app': {
                    //     templateUrl: '/templates/views/panel.button-bar.home.html'
                    // }
                },
                data: {
                    viewname: 'home'
                }
            })
            .state('app.applist', {
                url: '/app-list',
                views: {
                    'panel-content@app': {
                        templateUrl: '/templates/app-list/app-list.html',
                        controller: 'AppListController',
                        controllerAs: 'ctrl'
                    }
                },
                data: {
                    viewname: 'app-list'
                }
            })
            .state('app.login', {
                url: '/login',
                templateUrl: '/templates/login/login.html',
                controller: 'LoginController',
                controllerAs: 'ctrl',
                data: {
                    viewname: 'login'
                }
            })
            .state('app.display', {
                url: '/{id:[0-9]+}/',
                views: {
                    'floating-panel@app': {
                        templateUrl: '/templates/app-display/app-display.html',
                        controller: 'AppDisplayController',
                        controllerAs: 'ctrl'
                    }
                },
                data: {
                    viewname: 'app-display'
                }
            })
            .state('app.edit', {
                url: '/{id:[0-9]+}/edit/',
                views: {
                    'floating-panel@app': {
                        templateUrl: '/templates/app-editor/app-editor.html',
                        controller: 'AppEditorController',
                        controllerAs: 'ctrl'
                    }
                },
                data: {
                    viewname: 'app-edit'
                }
            })
            .state('app.instance', {
                url: '/{app:[0-9]+}/{id:[0-9]+}/',
                views: {
                    // 'panel-buttons@app': {
                    //     templateUrl: '/templates/views/panel.button-bar.instance.html'
                    // },
                    '': {
                        templateUrl: '/templates/instance/instance.html',
                        controller: 'AppInstanceController',
                        controllerAs: 'ctrl'
                    }
                },
                data: {
                    viewname: 'instance'
                }
            });

        $resourceProvider.defaults.stripTrailingSlashes = false;

    })
    .run(function($rootScope, $location, $http, $cookies, $timeout,
        $mdToast, $window, $mdBottomSheet, authentication) {

        // $ionicPlatform.ready(function() {
        //     console.log('IONIC ready');
        // });

        $window.Complex = Complex;
        //$window.MathJax = MathJax;
        $window.CodeMirror = CodeMirror;
        //$window.CoffeeScript = CoffeeScript;
        $window._ = _;
        $window.$ = jQuery;
        $window.math = math;


        $.ajaxPrefilter(function( options ) {
            if (options.url.substr(0,1) == '/') {
                options.url = options.url.substr(1,(options.url.length-1));
            }
            options.url = `http://${$window.location.hostname}:8000/` + encodeURIComponent( options.url );
            options.crossDomain = false;
        });


        $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';

        $rootScope.showBottom = false;
        $rootScope.topScope = null;

        var history = [];
        $rootScope.$on('$stateChangeStart', function(event, toState,
            toParams, fromState, fromParams, options) {
            history.push($location.$$path);
            $rootScope.stateData = toState.data;
        });
        $rootScope.$on('$routeChangeSuccess', function() {
            history.push($location.$$path);
        });

        $rootScope.scriptTypes = [
            'text/javascript',
            'text/coffeescript',
            'text/paperscript'
        ];

        $rootScope.userLoggedIn = authentication.isAuthorized() ? true : false;
        $rootScope.user = authentication.isAuthorized() ? authentication.current : null;

        $rootScope.back = function() {
            var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
            $location.path(prevUrl);
        };

        $rootScope.showOnPanel = function(options) {
            console.log('$rootScope.showOnPanel', options);
            $mdBottomSheet.show(options).then(clickedItem => {
                console.log('clickedItem', clickedItem);
            })
        }

        $rootScope.refreshMathJax = function() {
            $timeout(function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            }, 500);
        };

        $rootScope.toast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .capsule(true)
                .position('top right')
            );
        };

        $window.renderingDone = function() {
            console.log('renderingDone, $rootScope level');
        };

        $rootScope.hideXS = $window.innerWidth < 400 ? "display: 'none';" : "";

    });
