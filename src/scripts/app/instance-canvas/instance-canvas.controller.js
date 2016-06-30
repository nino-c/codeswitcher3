import 'angular';

export default class InstanceCanvasController {
    constructor($rootScope, api) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.api = api;

        $rootScope.topScope.$watch('$ctrl.currentInstanceId', (instanceId) => {

            if (!instanceId) return;

            if ($rootScope.topScope.canvasLoadConfig.loadFromServer) {
                console.log('EXEC directive, load');
                api.InstanceService.get({
                        id: parseInt(instanceId)
                    })
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

}

// class InstanceCanvasController {
//
//     constructor($rootScope, api) {
//         'ngInject';
//
//         this.$rootScope = $rootScope;
//         this.api = api;
//
//     }
//
//     execInstance() {
//         console.log('****  execInstance  ****');
//     }
//
//     $onInit() {
//         console.log('InstanceCanvasController $onInit');
//     }
//
//     $onChanges(obj) {
//         console.log('InstanceCanvasController $onChanges', obj);
//         if (obj.instanceId && obj.instanceId.currentValue) {
//             console.log('EXEC directive, load');
//             this.api.InstanceService.get({ id: parseInt(instanceId)})
//                 .$promise.then(instance => { execInstance(instance); });
//         }
//     }
//
//     $onDestroy() {
//         console.log('InstanceCanvasController $onDestroy');
//     }
//
// }
