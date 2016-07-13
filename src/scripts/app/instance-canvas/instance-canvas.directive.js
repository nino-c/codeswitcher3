import 'angular';
import {Inject} from 'angular-es6';

let SeedListValue = () => {

    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            value: '@',
            type: '@'
        },
        template: '<span ng-switch="type" class="seed-list-value">'
                    + '<span ng-switch-when="color" class="list-value">'
                        + '<div style="background-color: {{ value }}; width: 15px; height: '
                            +'15px; border: 1px solid #dddddd;"></div>'
                        //+ '<colorbox hex="{{ value }}"></colorbox>'
                    + '</span>'
                    + '<span ng-switch-when="math" class="math">'
                        + '${{ value }}$'
                    + '</span>'
                    + '<span ng-switch-default class="list-value">'
                        + '{{ value }}'
                    + '</span>'
                + '</span>',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$render = function() {
                scope.type = ngModel.$viewValue.type;
                scope.value = ngModel.$viewValue.value;
            }
        }
    }
}


let SeedList = ($compile) => {
    'ngInject';

    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            seedlings: '@'
        },
        transclude: true,
        template: '<div><div ng-repeat="seedling in seedlings" class="seedline">'
            + '<strong>{{ seedling[0] }}:</strong>'
            + '<seed-list-value ng-model="seedling[1]"></seed-list-value>'
            + '</div></div>',
        link: function(scope, element, attrs, ngModel) {
            scope.seedlings = [];
            ngModel.$render = function() {
                scope.seedlings = _.pairs(ngModel.$viewValue);
            }
        }
    }
}

let Colorbox = () => {
    return {
        scope: {
            hex: '='
        },
        template:'<div style="background-color: {{ hex }}; width: 15px; height: '
                +'15px; border: 2px solid #dddddd;"></div>',
        link: function(scope, element, attrs) {
            //scope.hex = attrs.hex;
            console.log('colorbox', scope, element, attrs);
        }
    }
}

let PaperscriptCanvas = ($compile, $http) => {
    'ngInject';

    return {
        restrict: 'E',
        link: (scope, element, attrs) => {

            // load script
            let script = null;
            $http.get(attrs.source).then(response => {
                console.log('RESPONSE', response);
                script = response.data;

                let compiledScript = traceur.Compiler.script(script);
                console.log('***COMPILED SCRIPT', compiledScript);

                element.html('<canvas id="bg-canvas" class="canvas-fullscreen" resize="true" '
                    + ' ng-click="window.clickHandler($event)"'
                    + ' keepalive="true"></canvas>'
                    + '<script type="text/paperscript" canvas="bg-canvas">'
                    + compiledScript
                    + '</script>');
                $compile(element.contents())(scope);
                paper.PaperScript.load();


            }, response => {
                console.log('ERROR RESPONSE', response);
                element.html('<div class="error">Could not load script ' + attrs.source + '</div>');
                $compile(element.contents())(scope);
            })

        }
    }
}


let AppInstanceCanvas = ($rootScope, $compile, $state, InstanceService) => {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            currentInstanceId: '=',
            canvasLoadConfig: '=',
            position: '='
        },
        link: ($scope, element, attrs) => {

            let execInstance = (instance) => {

                console.log('execInstance', instance);

                $scope.instance = instance;
                $rootScope.topScope.currentInstance = instance;
                $rootScope.$broadcast('on-set-current-instance');

                var dialect = instance.game.scriptType;
                var seedStructure = JSON.parse(instance.game.seedStructure);
                var seed = JSON.parse(instance.seed);

                var seedcodelines = [];
                seedcodelines.push('var seed = ' + instance.seed + ';');
                seedcodelines.push('var canvas = $("#bg-canvas");')
                seedcodelines.push('var Canvas = document.getElementById("bg-canvas");')
                seedcodelines.push('canvas.css({\'display\':\'block\'});')
                seedcodelines.push('Canvas.width = $(window).width();')
                seedcodelines.push('Canvas.height = $(window).height()-50;')

                // import seed attributes into local namespace
                for (var attr in seed) {

                    var line = '';
                    var k = seedStructure[attr].varname ?
                        seedStructure[attr].varname : attr;

                    switch (seed[attr].type) {
                        case 'string':
                        case 'color':
                            line = "var " + k + " = \"" + seed[attr].value.toString() + "\";"
                            break;
                        case 'math':
                            line = "var " + k + " = " + JSON.stringify(seed[attr]) + ";"
                            break;
                        case 'javascript':
                            line = "var " + k + " = " + seed[attr].value + ";"
                            break;
                        case 'number':
                            line = "var " + k + " = " + seed[attr].value.toString() + ";"
                            break;
                    }

                    seedcodelines.push(line);

                }



                var required_codeblocks = '';
                if (instance.game.required_modules.length > 0) {
                    required_codeblocks = _.map(
                        instance.game.required_modules,
                        function(mod) {
                            return mod.source;
                        }).join("\n\n");
                }

                if (dialect == 'text/coffeescript') {

                    var coffee_seedcodelines = _.map(seedcodelines, function(line) {
                        return line.split('var ').join('').split(';').join('');
                    });

                    instance.sourcecode += "\ntry\n\twindow.start()\ncatch error\n\tconsole.log error";
                    instance.sourcecode = CoffeeScript.compile(instance.sourcecode);
                    var source = seedcodelines.join("\n") + "\n"
                        + instance.sourcecode;

                } else {
                    instance.sourcecode += "\n try { window.start(); } catch(e) {}"
                    var source = seedcodelines.join("\n") + "\n" + required_codeblocks + "\n" + instance.sourcecode;
                }

                if (source.indexOf('window.renderingDone()') == -1) {
                    source += "\n\nwindow.renderingDone()";
                }

                let stylename = 'fullscreen';
                if (attrs.position == 'inline') {
                    stylename = 'inline-canvas';
                }

                switch (dialect) {
                    case 'text/paperscript':
                        element.html('<canvas id="bg-canvas" class="'
                            + stylename + '"></canvas>' + '<script type="'
                            + dialect + '" canvas="bg-canvas">' + source + '</script>');
                        console.log('$scope---', element.contents());
                        $compile(element.contents())($scope);
                        eval(seedcodelines);
                        paper.PaperScript.load();
                        break;
                    default:
                        element.html('<canvas id="bg-canvas" class="'
                            + stylename + '"></canvas>');
                        $compile(element.contents())($scope);
                        eval(seedcodelines);
                        $window.Canvas = angular.element(element);
                        eval(source);
                        break;
                }

            }

            $scope.$parent.$watch('$ctrl.currentInstanceId', function(instanceId) {

                if (!instanceId) return;
                console.log('******instanceId', instanceId);

                if ($rootScope.topScope.canvasLoadConfig.loadFromServer) {
                    console.log('EXEC directive, load');
                    InstanceService.get({
                            id: parseInt(instanceId)
                        })
                        .$promise.then(function(instance) {
                            execInstance(instance);
                        });

                } else {
                    console.log('EXEC directive, NONload');
                    if ($rootScope.topScope.instance) {
                        execInstance($rootScope.topScope.instance);
                    }
                }

            });

        }
    }

}


export {AppInstanceCanvas, PaperscriptCanvas, Colorbox, SeedList, SeedListValue};
// class AppInstanceCanvas {
//     constructor($rootScope, api) {
//         'ngInject';
//
//         $rootScope = $rootScope;
//         this.api = api;
//
//         this.restrict = 'E';
//         this.scope = {
//             currentInstanceId: '=',
//             canvasLoadConfig: '='
//         };
//
//     }
//
//     compile(tElement) {
//         console.log('compile, tElement', tElement);
//     }
//
//
// }

// function($rootScope, $compile, api) {
//     'ngInject';
//
//     return {
//         restrict: 'E',
//         scope: {
//             currentInstanceId: '=',
//             canvasLoadConfig: '='
//         },
//         link: function($scope, element, attrs) {
//
//
//
//             $scope.$parent.$watch('$ctrl.currentInstanceId', function(instanceId) {
//
//                 if (!instanceId) return;
//                 //console.log('$watch currentInstanceId', instanceId);
//
//                 if ($rootScope.topScope.canvasLoadConfig.loadFromServer) {
//                     console.log('EXEC directive, load');
//                     api.InstanceService.get({
//                             id: parseInt(instanceId)
//                         })
//                         .$promise.then(function(instance) {
//                             execInstance(instance);
//                         });
//
//                 } else {
//                     console.log('EXEC directive, NONload');
//                     if ($rootScope.topScope.instance) {
//                         execInstance($rootScope.topScope.instance);
//                     }
//                 }
//
//             });
//         }
//     };
// }
