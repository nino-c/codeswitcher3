import 'angular';

export default class BottomPanelController {
    constructor($scope, $mdBottomSheet) {
        'ngInject';

        this.actions = [
            {label: 'Browse Apps', icon: 'apps', classes: ''},
            {label: 'View source-code', icon: 'remove_red_eye_black', classes: 'md-accent'},
            {label: 'Snapshot', icon: 'photo_camera', classes: 'md-primary'},
            {label: 'Next app', icon: 'arrow_forward', classes: ''},
            {label: 'Edit Seed', icon: 'settings', classes: ''}
        ];

        this.actionClicked = $index => {
            $mdBottomSheet.hide(this.items[$index]);
        }

    }
}
