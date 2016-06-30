/*
     *   Interface for bottom-bar:
     *      - currentInstance:instance
     *      - view:{ home | app-list | app-instances | instance }
*/

export default class PanelController {
    constructor($rootScope, $scope, $location) {
        'ngInject';

        this.initPanel = function() {

        }

        this._nextApp = function() {
            console.log($scope);
        }
    }
}
