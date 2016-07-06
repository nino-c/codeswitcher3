import 'angular';
import AppListController from './app-list.controller';
import './app-list.scss';

let applist = angular.module('app.applist', []);
applist.controller('AppListController', AppListController);

export default applist.name;
