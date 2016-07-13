
import Complex from 'complex';
import '../services';


let directives = angular.module('directives', []);

directives
    .directive('scrollTo', $uiViewScroll => {
        'ngInject';

        return {
            restrict: 'A',
            link: (scope, element, attr) => {
                console.log('scrollto', element);
                $uiViewScroll(element);
            }
        }
    })
    .directive('scrollToTop', ($window, $timeout) => {
        'ngInject';

        return {
            restrict: 'A',
            link: (scope, element, attr) => {
                $timeout(() => {
                    $window.scrollTo(0,0);
                })
            }
        }
    })
    .directive('seedListValue', () => {
        'ngInject';

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
    })
    .directive('seedList', $compile => {
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
    })
    .directive('colorbox', () => {
        'ngInject';

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
    })
    .directive('paperscriptCanvas', function($compile) {
        'ngInject';

        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                element.html('<canvas id="paperscript-canvas" class="canvas-fullscreen" resize="true" '
                    + ' ng-click="window.clickHandler($event)"'
                    + ' keepalive="true"></canvas>'
                    + '<script type="text/paperscript" canvas="bg-canvas" src="'
                    + attrs.source +'"></script>');
                $compile(element.contents())(scope);
                paper.PaperScript.load();
            }
        }
    })
    .directive('appInstanceCanvas', function ($rootScope, $compile, $route, api) {
        'ngInject';

        return {
            restrict: 'E',
            scope: {
                currentInstanceId: '=',
                canvasLoadConfig: '='
            },
            link: function ($scope, element, attrs) {

                function execInstance(instance) {
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
                    seedcodelines.push( 'var seed = ' + instance.seed + ';' );
                    //window.Canvas = angular.element(element);
                    // canvas declarations
                    //if (dialect.indexOf('paperscript') == -1) {
                        seedcodelines.push( 'var canvas = $("#bg-canvas");' )
                        seedcodelines.push( 'var Canvas = document.getElementById("bg-canvas");' )
                        seedcodelines.push( 'canvas.css({\'display\':\'block\'});' )
                        seedcodelines.push( 'Canvas.width = $(window).width();' )
                        seedcodelines.push( 'Canvas.height = $(window).height()-50;' )
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
                                line = "var " + k + " = \""
                                    + seed[attr].value.toString() + "\";"
                                break;
                            case 'math':
                                line = "var " + k + " = "
                                    + JSON.stringify(seed[attr]) + ";"
                                break;
                            case 'javascript':
                                line = "var " + k + " = "
                                    + seed[attr].value + ";"
                                break;
                            case 'number':
                                line = "var " + k + " = "
                                    + seed[attr].value.toString() + ";"
                                break;
                        }

                        seedcodelines.push(line);

                    }



                    var required_codeblocks = '';
                    if (instance.game.required_modules.length > 0) {
                        required_codeblocks = _.map(
                            instance.game.required_modules, function(mod) {
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
                        var source = seedcodelines.join("\n") + "\n"
                            + required_codeblocks + "\n"
                            + instance.sourcecode;
                    }





                    if (source.indexOf('window.renderingDone()') == -1) {
                        source += "\n\nwindow.renderingDone()";
                    }

                    switch (dialect) {
                        case 'text/paperscript':
                            //$parent.clearPaperCanvas();
                            element.html('<canvas id="bg-canvas" class="canvas-fullscreen"></canvas>'
                                + '<script type="' + dialect + '" canvas="bg-canvas">'
                                + source +'</script>');
                            $compile(element.contents())($scope);
                            //console.log(source);
                            eval( seedcodelines );
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
                    //console.log('$watch currentInstanceId', instanceId);

                    if ($rootScope.topScope.canvasLoadConfig.loadFromServer) {
                        console.log('EXEC directive, load');
                        api.InstanceService.get({id:parseInt(instanceId)})
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
        };
    })
    .directive("bnLazySrc", ( $window, $document ) => {
        'ngInject';
        // I manage all the images that are currently being
        // monitored on the page for lazy loading.
        var lazyLoader = (function() {
            // I maintain a list of images that lazy-loading
            // and have yet to be rendered.
            var images = [];
            // I define the render timer for the lazy loading
            // images to that the DOM-querying (for offsets)
            // is chunked in groups.
            var renderTimer = null;
            var renderDelay = 100;
            // I cache the window element as a jQuery reference.
            var win = $( $window );
            // I cache the document document height so that
            // we can respond to changes in the height due to
            // dynamic content.
            var doc = $document;
            var documentHeight = doc.height();
            var documentTimer = null;
            var documentDelay = 2000;
            // I determine if the window dimension events
            // (ie. resize, scroll) are currenlty being
            // monitored for changes.
            var isWatchingWindow = false;
            // ---
            // PUBLIC METHODS.
            // ---
            // I start monitoring the given image for visibility
            // and then render it when necessary.
            function addImage( image ) {
                images.push( image );
                if ( ! renderTimer ) {
                    startRenderTimer();
                }
                if ( ! isWatchingWindow ) {
                    startWatchingWindow();
                }
            }
            // I remove the given image from the render queue.
            function removeImage( image ) {
                // Remove the given image from the render queue.
                for ( var i = 0 ; i < images.length ; i++ ) {
                    if ( images[ i ] === image ) {
                        images.splice( i, 1 );
                        break;
                    }
                }
                // If removing the given image has cleared the
                // render queue, then we can stop monitoring
                // the window and the image queue.
                if ( ! images.length ) {
                    clearRenderTimer();
                    stopWatchingWindow();
                }
            }
            // ---
            // PRIVATE METHODS.
            // ---
            // I check the document height to see if it's changed.
            function checkDocumentHeight() {
                // If the render time is currently active, then
                // don't bother getting the document height -
                // it won't actually do anything.
                if ( renderTimer ) {
                    return;
                }
                var currentDocumentHeight = doc.height();
                // If the height has not changed, then ignore -
                // no more images could have come into view.
                if ( currentDocumentHeight === documentHeight ) {
                    return;
                }
                // Cache the new document height.
                documentHeight = currentDocumentHeight;
                startRenderTimer();
            }
            // I check the lazy-load images that have yet to
            // be rendered.
            function checkImages() {
                // Log here so we can see how often this
                // gets called during page activity.
                //console.log( "Checking for visible images..." );
                var visible = [];
                var hidden = [];
                // Determine the window dimensions.
                var windowHeight = win.height();
                var scrollTop = win.scrollTop();
                // Calculate the viewport offsets.
                var topFoldOffset = scrollTop;
                var bottomFoldOffset = ( topFoldOffset + windowHeight );
                // Query the DOM for layout and seperate the
                // images into two different categories: those
                // that are now in the viewport and those that
                // still remain hidden.
                for ( var i = 0 ; i < images.length ; i++ ) {
                    var image = images[ i ];
                    if ( image.isVisible( topFoldOffset, bottomFoldOffset ) ) {
                        visible.push( image );
                    } else {
                        hidden.push( image );
                    }
                }
                // Update the DOM with new image source values.
                for ( var i = 0 ; i < visible.length ; i++ ) {
                    visible[ i ].render();
                }
                // Keep the still-hidden images as the new
                // image queue to be monitored.
                images = hidden;
                // Clear the render timer so that it can be set
                // again in response to window changes.
                clearRenderTimer();
                // If we've rendered all the images, then stop
                // monitoring the window for changes.
                if ( ! images.length ) {
                    stopWatchingWindow();
                }
            }
            // I clear the render timer so that we can easily
            // check to see if the timer is running.
            function clearRenderTimer() {
                clearTimeout( renderTimer );
                renderTimer = null;
            }
            // I start the render time, allowing more images to
            // be added to the images queue before the render
            // action is executed.
            function startRenderTimer() {
                renderTimer = setTimeout( checkImages, renderDelay );
            }
            // I start watching the window for changes in dimension.
            function startWatchingWindow() {
                isWatchingWindow = true;
                // Listen for window changes.
                win.on( "resize.bnLazySrc", windowChanged );
                win.on( "scroll.bnLazySrc", windowChanged );
                // Set up a timer to watch for document-height changes.
                documentTimer = setInterval( checkDocumentHeight, documentDelay );
            }
            // I stop watching the window for changes in dimension.
            function stopWatchingWindow() {
                isWatchingWindow = false;
                // Stop watching for window changes.
                win.off( "resize.bnLazySrc" );
                win.off( "scroll.bnLazySrc" );
                // Stop watching for document changes.
                clearInterval( documentTimer );
            }
            // I start the render time if the window changes.
            function windowChanged() {
                if ( ! renderTimer ) {
                    startRenderTimer();
                }
            }
            // Return the public API.
            return({
                addImage: addImage,
                removeImage: removeImage
            });
        })();
        // ------------------------------------------ //
        // ------------------------------------------ //
        // I represent a single lazy-load image.
        function LazyImage( element ) {
            // I am the interpolated LAZY SRC attribute of
            // the image as reported by AngularJS.
            var source = null;
            // I determine if the image has already been
            // rendered (ie, that it has been exposed to the
            // viewport and the source had been loaded).
            var isRendered = false;
            // I am the cached height of the element. We are
            // going to assume that the image doesn't change
            // height over time.
            var height = null;
            // ---
            // PUBLIC METHODS.
            // ---
            // I determine if the element is above the given
            // fold of the page.
            function isVisible( topFoldOffset, bottomFoldOffset ) {
                // If the element is not visible because it
                // is hidden, don't bother testing it.
                if ( ! element.is( ":visible" ) ) {
                    return( false );
                }
                // If the height has not yet been calculated,
                // the cache it for the duration of the page.
                if ( height === null ) {
                    height = element.height();
                }
                // Update the dimensions of the element.
                var top = element.offset().top;
                var bottom = ( top + height );
                // Return true if the element is:
                // 1. The top offset is in view.
                // 2. The bottom offset is in view.
                // 3. The element is overlapping the viewport.
                return(
                        (
                            ( top <= bottomFoldOffset ) &&
                            ( top >= topFoldOffset )
                        )
                    ||
                        (
                            ( bottom <= bottomFoldOffset ) &&
                            ( bottom >= topFoldOffset )
                        )
                    ||
                        (
                            ( top <= topFoldOffset ) &&
                            ( bottom >= bottomFoldOffset )
                        )
                );
            }
            // I move the cached source into the live source.
            function render() {
                isRendered = true;
                renderSource();
            }
            // I set the interpolated source value reported
            // by the directive / AngularJS.
            function setSource( newSource ) {
                source = newSource;
                if ( isRendered ) {
                    renderSource();
                }
            }
            // ---
            // PRIVATE METHODS.
            // ---
            // I load the lazy source value into the actual
            // source value of the image element.
            function renderSource() {
                element[ 0 ].src = source;
            }
            // Return the public API.
            return({
                isVisible: isVisible,
                render: render,
                setSource: setSource
            });
        }
        // ------------------------------------------ //
        // ------------------------------------------ //
        // I bind the UI events to the scope.
        function link( $scope, element, attributes ) {
            var lazyImage = new LazyImage( element );
            // Start watching the image for changes in its
            // visibility.
            lazyLoader.addImage( lazyImage );
            // Since the lazy-src will likely need some sort
            // of string interpolation, we don't want to
            attributes.$observe(
                "bnLazySrc",
                function( newSource ) {
                    lazyImage.setSource( newSource );
                }
            );
            // When the scope is destroyed, we need to remove
            // the image from the render queue.
            $scope.$on(
                "$destroy",
                function() {
                    lazyLoader.removeImage( lazyImage );
                }
            );
        }
        // Return the directive configuration.
        return({
            link: link,
            restrict: "A"
        });
    })

export default directives.name;
