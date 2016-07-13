export default class AppListController {
    constructor($rootScope, $timeout, $location, $window, api) {
        'ngInject';

        this.showSearch = false;
        this.loading = true;
        this.sortBy = '-popularity';

        $rootScope.showBottom = false;

        api.AppServiceMinimal.query().$promise.then(apps => {
            this.apps = apps;
            this.loading = false;
        });

        this.openSortMenu = function($mdOpenMenu, $event) {
            console.log($event);
            $event.stopPropagation();
            $mdOpenMenu($event);
        }

        this.initAppList = function() {
            console.log('AppList scope init');
        };


    }
}
