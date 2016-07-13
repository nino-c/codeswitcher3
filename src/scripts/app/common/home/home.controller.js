export default class HomeController {

    constructor($rootScope, $scope, $mdSidenav, $timeout) {
        'ngInject';


        this.initHome = () => {
            console.log('HomeController init');
            $timeout(() => {
                $scope.$parent.$ctrl.showBottomPanel();
            })

        }

    }

}
