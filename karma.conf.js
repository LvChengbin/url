// Karma configuration
// Generated on Tue Jul 11 2017 12:49:06 GMT+0800 (CST)

process.env.CHROME_BIN = require( 'puppeteer' ).executablePath();
const path = require( 'path' );
const  argv = require( 'optimist' ).argv;
const resolve = require( 'rollup-plugin-node-resolve' );
const buble = require( 'rollup-plugin-buble' );
const serve = require( 'koa-static' );

const rollupPlugins = [
    resolve( {
        module : true,
        jsnext : true
    } ),
];

if( argv.es5 ) {
    rollupPlugins.push(
        buble( {
            transforms : {
                dangerousForOf : true
            }
        } )
    );
}

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        // Most versions of PhantomJS do not suppport ES5 and ES6, so add es6-shim here to make sure all
        // test cases could be executed in PhantomJS
        frameworks: [ 'jasmine' ],


        // list of files / patterns to load in the browser
        files : ( () => {
            const files = [
                { pattern : 'src/**/*.js', included : false, watched : false }
            ];

            if( argv.file || argv.files ) {
                argv.file && files.push( {
                    pattern : argv.file.trim(),
                    included : true,
                    watched : false
                } );

                argv.files && argv.files.split( ',' ).forEach( file => {
                    files.push( {
                        pattern : file.trim(),
                        included : true,
                        watched : false
                    } );
                } );
            } else {
                files.push( {
                    pattern : 'test/**/*.spec.js',
                    included : true,
                    watched : false
                } );
            }

            return files;
        } )(),

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/**/*.js' : [ 'rollup', 'yolk' ],
        },

        // 
        rollupPreprocessor : {
            plugins : rollupPlugins,
            output : {
                format : 'iife'
            }
        },

        yolk : {
            debugging : false,
            routers( app ) {
                app.router.get( '/demo/(.*)', serve( path.join( __dirname, 'test' ) ) );
                app.router.get( '/dist/(.*)', serve( path.join( __dirname ) ) );
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 7997,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [ 'ChromeHeadless' ], //PhantomJS

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    } );
};
