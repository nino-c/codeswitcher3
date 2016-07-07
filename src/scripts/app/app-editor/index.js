import 'angular';

import AppEditorController from './app-editor.controller';

let appEditorModule = angular.module('app.editor', []);
appEditorModule.controller('AppEditorController', AppEditorController);

export default appEditorModule.name;
