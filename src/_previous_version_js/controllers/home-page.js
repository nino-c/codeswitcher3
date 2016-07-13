
export default class HomeController {

        constructor($rootScope, $scope, $timeout) {
            'ngInject';


            $scope.initHome = () => {
                console.log('HomeController scope init');
                console.log("should be ContentController", $scope.$parent);

                $rootScope.viewname = 'home';

                if (!$rootScope.showBottom) {
					$timeout(function() { $rootScope.showBottom = true; }, 200);
				}
            }

        }

}
