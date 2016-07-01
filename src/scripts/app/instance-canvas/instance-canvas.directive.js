import 'angular';

let AppInstanceCanvas = ($rootScope, $compile, api) => {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            currentInstanceId: '=',
            canvasLoadConfig: '='
        },
        link: ($scope, element, attrs) => {

            let execInstance = (instance) => {
                console.log('execInstance', instance);
                $rootScope.topScope.currentInstance = instance;

                var dialect = instance.game.scriptType;
                var seedStructure = JSON.parse(instance.game.seedStructure);
                var seed = JSON.parse(instance.seed);

                if ($rootScope.viewname == 'instance') {
                    $rootScope.viewscope.dialect = dialect;
                    $rootScope.viewscope.seedStructure = seedStructure;
                    $rootScope.viewscope.seed = seed;
                }

                // prepare code to eval
                // line-by-line for the system-generated part
                var seedcodelines = [];
                seedcodelines.push('var seed = ' + instance.seed + ';');
                //window.Canvas = angular.element(element);
                // canvas declarations
                //if (dialect.indexOf('paperscript') == -1) {
                seedcodelines.push('var canvas = $("#bg-canvas");')
                seedcodelines.push('var Canvas = document.getElementById("bg-canvas");')
                seedcodelines.push('canvas.css({\'display\':\'block\'});')
                seedcodelines.push('Canvas.width = $(window).width();')
                seedcodelines.push('Canvas.height = $(window).height()-50;')
                    //seedcodelines.push( 'console.log(Canvas);' )
                    //seedcodelines.push( 'console.log(canvas);' )
                    //}

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
                        //+ required_codeblocks + "\n"
                        + instance.sourcecode;

                } else {
                    instance.sourcecode += "\n try { window.start(); } catch(e) {}"
                    var source = seedcodelines.join("\n") + "\n" + required_codeblocks + "\n" + instance.sourcecode;
                }





                if (source.indexOf('window.renderingDone()') == -1) {
                    source += "\n\nwindow.renderingDone()";
                }

                switch (dialect) {
                    case 'text/paperscript':
                        //$parent.clearPaperCanvas();
                        // element.html('<canvas id="bg-canvas" class="canvas-fullscreen"></canvas>' + '<script type="' + dialect + '" canvas="bg-canvas">' + source + '</script>');
                        element.html('<canvas id="bg-canvas"></canvas>' + '<script type="' + dialect + '" canvas="bg-canvas">' + source + '</script>');
                        $compile(element.contents())($scope);
                        //console.log(source);
                        eval(seedcodelines);
                        //window.Canvas = angular.element(element);

                        paper.PaperScript.load();
                        //loading = false;
                        break;
                    default:
                        //$parent.clearCanvas();
                        element.html('<canvas id="bg-canvas"></canvas>');
                        $compile(element.contents())($scope);
                        //console.log($scope);

                        // extra_seedcodelines = [ 'var canvas = $("#bg-canvas");',
                        //     'var Canvas = document.getElementById("bg-canvas");'];

                        // eval(extra_seedcodelines.join("\n") + "\n" + seedcodelines );
                        //console.log('seedcodelines', seedcodelines);
                        eval(seedcodelines);

                        window.Canvas = angular.element(element);
                        //console.log('Canvas', Canvas);
                        //gameFunction = new Function('Canvas', source);
                        //gameFunction(Canvas);
                        //console.log(source);
                        eval(source);
                        //loading = false;

                        break;
                }

            }

            $scope.$parent.$watch('$ctrl.currentInstanceId', function(instanceId) {

                if (!instanceId) return;
                console.log('******instanceId', instanceId);

                if ($rootScope.topScope.canvasLoadConfig.loadFromServer) {
                    console.log('EXEC directive, load');
                    api.InstanceService.get({
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

        },
        // compile: (tElement) => {
        //     console.log('^^compile, tElement', tElement);
        // }
    }

}


export default AppInstanceCanvas;
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
