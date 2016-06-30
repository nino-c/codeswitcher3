'use strict';

var path = require('path');

module.exports = {
    entry: './src/scripts/main.js',
    resolve: {
        alias: {
            createjs: 'PreloadJS/lib/preloadjs-0.6.2.combined.js',
            SoundJS: 'SoundJS/lib/soundjs-0.6.2.combined.js',
            EaselJS: 'EaselJS/lib/easeljs-0.8.2.combined.js',
            paper: "paper/dist/paper-full.js",
            _: "underscore/underscore.js",
            //$: "jquery/dist/jquery.js",
            MathJax: "mathjax/MathJax.js"
            // "codemirror/addon/edit/matchbrackets.js",
            // "codemirror/mode/javascript/javascript.js",
            //CoffeeScript: "coffee-script/lib/coffee-script/coffee-script.js"
        }
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'ng-annotate!babel' },
            { test: /\.json$/, loader: 'json' },
            { test: /.*gsap.*/, loader: 'imports?gs=>window.GreenSockGlobals={}!exports?gs' },
            { test: /.*PreloadJS.*/, loader: 'imports?this=>global!exports?window.createjs' },
            { test: /.*SoundJS.*/, loader: 'imports?this=>global!exports?window.createjs' },
            { test: /.*EaselJS.*/, loader: 'imports?this=>global!exports?window.createjs' },
            {
                test: /\.scss$/,
                loaders: ['style', 'css?root=./src/scripts/app',
                    'autoprefixer-loader?browsers=last 2 versions', 'sass'],
            },
            //{ test: /\.coffee$/, loader: "coffee-loader" },
        ]
    },
    sassLoader: {
        includePaths: ["./src/scripts/app"]
    },
};
