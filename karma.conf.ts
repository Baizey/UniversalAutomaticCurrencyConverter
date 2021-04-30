require('karma');
require('karma-webpack');
require('karma-jasmine');
require('webpack');
require('karma-firefox-launcher');
module.exports = function (config: any) {
    config.set({
        files: [
            {pattern: "src/CurrencyConverter/**/*.ts"},
            {pattern: "src/Infrastructure/**/*.ts"},
            {pattern: 'tests/*.mock.ts'},
            {pattern: 'tests/*.test.ts'},
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript",
            "**/*.tsx": "karma-typescript"
        },
        exclude: [],
        port: 9876,
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