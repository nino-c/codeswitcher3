angular.module("app.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("index.html","<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\n    <meta name=\"keywords\" content=\"Interactive math, music, and art programming\" />\n    <meta name=\"description\" content=\"Mr. Code-switcher :: he who code-switched up-on the word \'code-switching\' itself.\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\n    <!-- opengraph tags -->\n    <meta property=\"og:site_name\" content=\"mrcodeswitcher.com\">\n    <meta property=\"og:type\" content=\"website\">\n    <meta property=\"og:title\" content=\"∀aa∃ :: Apps at an Exhibition\">\n    <meta property=\"og:description\" content=\"Mr. Code-switcher :: he who code-switched up-on the word \'code-switching\' itself.\">\n\n    <title ng-bind=\"pageTitle\"></title>\n\n    <!-- <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\" /> -->\n    <!-- <link href=\'https://fonts.googleapis.com/css?family=Roboto:400,300,500,200,100,100italic&subset=latin,greek,greek-ext,latin-ext\' rel=\'stylesheet\' type=\'text/css\'> -->\n\n    <link rel=\"stylesheet\" href=\"bootstrap.css\" type=\"text/css\" />\n    <link rel=\"stylesheet\" href=\"codemirror.css\" type=\"text/css\" />\n    <link rel=\"stylesheet\" href=\"mdn-like.css\" type=\"text/css\" />\n    <link rel=\"stylesheet\" href=\"angular-material.css\" type=\"text/css\" />\n    <link rel=\"stylesheet\" href=\"bundle.css\" type=\"text/css\" />\n\n    <script type=\"text/javascript\" src=\"jquery.js\"></script>\n    <script type=\"text/javascript\" src=\"underscore.js\"></script>\n    <script type=\"text/javascript\" src=\"paper-full.js\"></script>\n    <script type=\"text/javascript\" src=\"extra.js\"></script>\n\n    <!-- <script type=\"text/javascript\" src=\"MathJax.js\"></script> -->\n    <script type=\"text/x-mathjax-config\">\n        MathJax.Hub.Config({ tex2jax: {inlineMath: [[\'$\',\'$\'], [\'\\\\(\',\'\\\\)\']]} });\n    </script>\n    <!-- <script type=\"text/javascript\" src=\"https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML\"> -->\n    <script type=\"text/javascript\" src=\"MathJax.js\"></script>\n    </script>\n\n\n  </head>\n  <body>\n\n    <!-- <ui-view></ui-view> -->\n    <app-main />\n    <script src=\"main.js\"></script>\n\n  </body>\n</html>\n");
$templateCache.put("app-canvas/app-canvas.html","<app-instance-canvas\n    current-instance-id=\"currentInstanceId\">\n</app-instance-canvas>\n");
$templateCache.put("app-main/main.html","\n<div layout-xs=\"row\" layout-gt-xs=\"column\" layout-wrap>\n\n    <section flex ng-init=\"$ctrl.init()\">\n        <md-toolbar>\n            <div layout=\"row\" layout-align=\"start center\" layout-wrap>\n\n                <div class=\"toolbar-title\"\n                    ui-sref=\"app.home\" flex>Apps at an Exhibition</div>\n\n                <md-button class=\"md-button pull-right\" flex=\"nogrow\"\n                    ng-cloak ui-sref=\"app.login\"\n                    ng-if=\"!userLoggedIn\">Log in</md-button>\n\n                <md-button class=\"md-button pull-right\" flex=\"nogrow\"\n                    ng-cloak ng-click=\"ctrl.logout()\"\n                    ng-if=\"userLoggedIn\">Log out</md-button>\n\n            </div>\n\n        </md-toolbar>\n        <ui-view></ui-view>\n    </section>\n\n    <section flex>\n        <md-sidenav>\n            <md-content layout=\"column\" layout-padding>\n\n                <div ui-view=\"panel-content\" />\n                <div ui-view=\"panel-buttons\" />\n\n            </md-content>\n        </md-sidenav>\n    </section>\n\n</div>\n");
$templateCache.put("instance-tools/instance-tools.html","<h2>Instance Tools</h2>\n");}]);