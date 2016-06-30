import 'angular'
import 'angular-material';
import 'angular-ui-router';
import 'angular-route';
import 'angular-resource';
import 'angular-sanitize';
import 'angular-cookies';
//import 'angular-bootstrap';
import 'angular-animate';
import 'angular-ui-codemirror';

import './config';
import './config/templates';
import './services';
import './app-main';
import './instance-tools';

import numeric from 'numeric';
import underscore from 'underscore';
import Complex from 'complex';
import CodeMirror from 'codemirror';
//import CoffeeScript from 'coffee-script';
//import MathJax from 'mathjax';


window.app = angular.module('app', [
        'ui.router',
        'ngMaterial',
        //'ui.bootstrap',
        'ui.codemirror',
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'ngResource',
        'ngCookies',

        'app.config',
        'app.templates',
        'app.services',
        'app.main',
        'app.instancetools'
    ])
    .value('ui.config', {
        codemirror: {
            lineWrapping: true,
            lineNumbers: true,
            indentWithTabs: true,
            viewportMargin: Infinity,
            mode: 'javascript',
            matchBrackets: true,
            theme: "mdn-like"
        }
    })
    .config(($mdThemingProvider, $stateProvider, $urlRouterProvider,
        $resourceProvider, $mdIconProvider) => {
        'ngInject';

        $mdIconProvider.viewBoxSize = 16;
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('orange');

        $stateProvider
            .state('app', {
                url: '/app',
                views: {
                    '': {
                        template: 'rootpage'
                    },
                    'panel-content@': {
                        template: 'Panel1'
                    }
                }
            })
            // .state('app.home', {
            //     url: '/home',
            //     views: {
            //         '': {
            //             template: '***__*'
            //         },
            //         'panel-content@app': {
            //             template: 'TEST<instance-tools />'
            //         }
            //     }
            // })

        $urlRouterProvider.otherwise('/app')
        $resourceProvider.defaults.stripTrailingSlashes = false;

    })
    .run(($rootScope, $location, $http, $cookies, $timeout, $mdToast, $window,
        $document, $state, authentication) => {

        // attach 3rd-party libraries to window
        $window.Complex = Complex;
        //$window.MathJax = MathJax;
        $window.CodeMirror = CodeMirror;
        //$window.CoffeeScript = CoffeeScript;

        //$state.go('app')

        // configure http/ajax/request defaults
        $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';

        // $.ajaxPrefilter(function( options ) {
        // 	if (options.url.substr(0,1) == '/') {
        // 		options.url = options.url.substr(1,(options.url.length-1));
        // 	}
        // 	options.url = `http://${$window.location.hostname}:8000/`
        // 		+ encodeURIComponent( options.url );
        // 	options.crossDomain = false;
        // });

        // navigation, history, state
        var history = [];
        $rootScope.$on('$stateChangeStart', function(event, toState,
            toParams, fromState, fromParams, options) {

            console.log('$stateChangeStart', toState);
            history.push($location.$$path);
            $rootScope.stateData = toState.data;
        });

        $rootScope.$on('$viewContentLoaded', (event, view) => {
            console.log('$viewContentLoaded', event, view);
        });

        $rootScope.$on('$routeChangeSuccess', function() {
            history.push($location.$$path);
        });

        // user
        $rootScope.userLoggedIn = authentication.isAuthorized() ? true : false;
        $rootScope.user = authentication.isAuthorized() ? authentication.current : null;

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

    });
