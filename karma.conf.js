require('karma');
require('karma-webpack');
require('karma-jasmine');
require('webpack');

module.exports = function (config) {
    config.set({
        files: [
            'src/*.js',
            'tests/*.js'
        ],
        exclude: [
            'src/Browser.js',
            'src/background.js'
        ],
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: true,
        concurrency: Infinity,
        port: 9876,
        basePath: "",
        frameworks: ["jasmine"],
        browsers: ["ChromeHeadless"],
        customLaunchers: {
            Chrome_travis_ci: {
                base: "Chrome",
                flags: ["--no-sandbox"]
            }
        },
    });
};