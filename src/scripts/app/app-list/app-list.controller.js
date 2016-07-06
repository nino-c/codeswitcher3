export default class AppListController {
    constructor($rootScope, $scope, $timeout, $location, $window,
        $mdBottomSheet, $mdSidenav, AppServiceMinimal) {
        'ngInject';

        this.showSearch = false;
        this.loading = true;
        this.sortBy = '-popularity';
        this.apps = [];

        $rootScope.showBottom = false;

        this.openSortMenu = function($mdOpenMenu, $event) {
            console.log($event);
            $event.stopPropagation();
            $mdOpenMenu($event);
        }

        this.initAppList = function() {
            console.log('AppList scope init', this.$parent);
            AppServiceMinimal.query().$promise.then(apps => {
                this.apps = apps;
                this.loading = false;
            });
            $timeout(() => {
                $mdBottomSheet.hide();
                $mdSidenav('sidenavRight').open();
            })

        };

        $scope.$destroy = function() {
            $mdSidenav('sidenavRight').close();
        }

    }

}
