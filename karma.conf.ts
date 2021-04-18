require('karma');
require('karma-webpack');
require('karma-jasmine');
require('webpack');
require('karma-firefox-launcher');
module.exports = function (config: any) {
    config.set({
        files: [
            'src/Infrastructure/**/*.ts',
            'src/CurrencyConverter/**/*.ts',
            'tests/*.mock.ts',
            'tests/*.test.ts'
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript",
            "**/*.tsx": "karma-typescript"
        },
        exclude: [],
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: true,
        concurrency: Infinity,
        port: 9876,
        reporters: ["progress", "karma-typescript"],
        basePath: "",
        frameworks: ["jasmine", "karma-typescript"],
        browsers: ["ChromeHeadless", "FirefoxHeadless"],
        customLaunchers: {
            Chrome_travis_ci: {
                base: "Chrome",
                flags: ["--no-sandbox"]
            },
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless'],
            }
        },
    });
};