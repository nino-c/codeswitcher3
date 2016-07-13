/*
     *   Interface for bottom-bar:
     *      - currentInstance:instance
     *      - view:{ home | app-list | app-instances | instance }
*/

export default class BottomBarController {
    constructor($rootScope, $scope, $location) {
        'ngInject';

        // $scope.currentInstance = $rootScope.currentInstance;
        //
        // $scope.initBottomBar = function() {
        //     console.log('initBottomBar');
        //     $rootScope.$watch('currentInstance', function(instance) {
        //         $scope.currentInstance = instance;
        //     })
        // };
        //
        // $scope.browseApps = function($event) {
        //     $event.stopPropagation();
        //     $location.path('/apps-list/');
        //     //$rootScope.showBottom = false;
        // };

        this.isInstance = Boolean($rootScope.topScope.viewname == 'instance');

        this._nextApp = function() {
            console.log($scope);
        }
    }
}
