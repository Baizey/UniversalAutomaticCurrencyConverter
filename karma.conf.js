require('karma');
require('karma-webpack');
require('karma-jasmine');
require('webpack');
require('karma-firefox-launcher');
module.exports = config => config.set({
    files: [
        {pattern: "src/CurrencyConverter/**/*.ts"},
        {pattern: "src/Infrastructure/**/*.ts"},
        {pattern: 'tests/*.mock.ts'},
        {pattern: 'tests/*.test.ts'},
    ],
    exclude: [],
    preprocessors: {
        "**/*.ts": "karma-typescript",
        "**/*.tsx": "karma-typescript"
    },
    webpack: {mode: 'development'},
    singleRun: true,
    bundlerOptions: {sourceMap: true},
    reporters: ["karma-typescript"],
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