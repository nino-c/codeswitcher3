import 'angular';

export default class BottomPanelController {
    constructor($scope, $state, $rootScope, $mdBottomSheet) {
        'ngInject';

        this.init = () => {
            this.instance = $rootScope.topScope.currentInstance;
            $scope.$on('on-set-current-instance', () => {
                this.instance = $rootScope.topScope.currentInstance;
            });
        };

        this.actions = [
            // {label: 'Browse Apps', icon: 'apps', classes: ''},
            // {label: 'Snapshot', icon: 'photo_camera', classes: 'md-primary'},

            { label: 'View',
                icon: 'remove_red_eye_black',
                classes: '',
                click: '$state.go(\'app.display\', {id:this.instance.game.id})' },
            { label: 'Source',
                icon: 'code',
                classes: '',
                click: '$rootScope.topScope.viewSource($event)' },
            { label: 'Seed',
                icon: 'settings',
                classes: '',
                click: '$state.go(\'app.instance\', {app: this.instance.game.id, id: this.instance.id})' }
            // {label: 'Next App', icon: 'arrow_forward', classes: ''}
        ];

        this.actionClicked = ($event, $index) => {
            console.log('click', this.actions[$index].click);
            eval(this.actions[$index].click);
        };

    }

}
