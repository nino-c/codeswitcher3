//import './login.less';
import angular from 'angular';
//import routing from './login.routes';
import LoginController from './login.ctrl';

let loginModule = angular.module('app.login', [])
    .controller('LoginController', LoginController);

export default loginModule.name;
