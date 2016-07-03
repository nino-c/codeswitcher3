import 'angular';

export default class BottomPanelController {
    constructor($scope, $rootScope, $mdBottomSheet) {
        'ngInject';

        this.init = () => {
            this.instance = $rootScope.topScope.currentInstance;
            $scope.$on('on-set-current-instance', () => {
                this.instance = $rootScope.topScope.currentInstance;
            })
        }

        this.actions = [
            //{label: 'Browse Apps', icon: 'apps', classes: ''},

            //{label: 'Snapshot', icon: 'photo_camera', classes: 'md-primary'},

            {label: 'View source-code', icon: 'remove_red_eye_black', classes: ''},
            {label: 'Edit App', icon: 'settings', classes: ''}
            // {label: 'Next App', icon: 'arrow_forward', classes: ''}
        ];

        this.actionClicked = $index => {
            $mdBottomSheet.hide(this.items[$index]);
        }

    }

}
