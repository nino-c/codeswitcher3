import 'angular';
import './instance-information.scss';

import InstanceInformationController from './instance-information.controller';

let instanceinformationModule = angular.module('app.instanceinformation', []);
instanceinformationModule.controller('InstanceInformationController', InstanceInformationController);

export default instanceinformationModule.name;
