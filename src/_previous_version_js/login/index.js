//import './login.less';
import angular from 'angular';
//import routing from './login.routes';
import LoginController from './login.ctrl';

export default angular.module('login', [])
    //.config(routing)
    .controller('LoginController', LoginController)
    .name;
