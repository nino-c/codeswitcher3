import 'angular';
import 'angular-resource';
import config from '../config';


function createResourceService(url, params, update) {
    let actions = update ? { update: { method: 'PUT' }} : {};
    let func = function($resource, config) {
        'ngInject';
        return $resource(`${config.ENDPOINT}${url}`, params, actions);
    }
    return func;
}

let AppService = createResourceService('/api/apps/:id/', {id:'@id'}, true);
let AppServiceMinimal = createResourceService('/api/apps-minimal/:id/', {id:'@id'}, true);
let InstanceService = createResourceService('/api/instances/:id/', {id:'@id'}, true);
let OrderedInstanceService = createResourceService('/api/instances-ordered/:id/', {id:'@id'}, false);
let CodeModuleService = createResourceService('/api/code_modules/:id/', {id:'@id'}, true);

export {AppService, AppServiceMinimal, InstanceService, OrderedInstanceService, CodeModuleService};

// export default class API {
//     constructor($resource, $rootScope, config) {
//         'ngInject';
//
//         this.config = config;
//         this.token = localStorage.getItem(this.config.AUTH_KEY);
//
//         this.AppService = $resource(this.endpointUrl('/api/apps/:id/'), {id:'@id'}, {
//             update: {
//                 method: 'PUT'
//             }
//         });
//
//         this.AppServiceMinimal = $resource(this.endpointUrl('/api/apps-minimal/:id/'), {id:'@id'}, {
//             update: {
//                 method: 'PUT'
//             },
//         });
//
//         this.InstanceService = $resource(this.endpointUrl('/api/instances/:id/'), {id:'@id'}, {
//             update: {
//                 method: 'PUT'
//             }
//         });
//
//         this.OrderedInstanceService = $resource(this.endpointUrl('/api/instances-ordered/:id/'), { id:'@id'});
//
//         this.CodeModuleService = $resource(this.endpointUrl('/api/code_modules/:id/'), {id:'@id'}, {
//             update: {
//                 method: 'PUT'
//             }
//         });
//
//         this.CategoryService = $resource(this.endpointUrl('/api/categories/:id/'), {id:'@id'}, {
//             update: {
//                 method: 'PUT'
//             }
//         });
//
//         this.CategoryWithApps = $resource(this.endpointUrl('/api/categories-with-apps/:id/'), {id:'@id'});
//
//     }
//
//     endpointUrl(url) {
//         return `${this.config.ENDPOINT}${url}`;
//     }
// }

// let instanceFactory = function($http) {
//     'ngInject';
//
//     let InstanceFactory = function(app_id) {
//
//         this.$http = $http;
//         this.app_id = app_id;
//         this.items = [];
//         this.loading = false;
//         this.page = 1;
//         this.itemsPerRequest = 10;
//         console.log('InstanceFactory', app_id);
//
//     }
//
//     InstanceFactory.prototype.next = function() {
//         if (this.loading) return;
//         this.loading = true;
//         this.url = `${config.ENDPOINT}/api/instances-ordered/${this.app_id}/?page=${this.page}`;
//         console.log('instanceFactory URL', this.url, this);
//         this.$http.jsonp(this.url).success(function(data) {
//             console.log(data);
//             this.items = this.items.concat(_.map(data.data.children, function(item) {
//                 return item.data;
//             }))
//             this.loading = false;
//         }.bind(this));
//     }
//
//     return InstanceFactory;
// }
