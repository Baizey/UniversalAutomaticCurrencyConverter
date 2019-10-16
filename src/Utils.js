let _TimerInstance;

class Timer {

    static instance() {
        return _TimerInstance ? _TimerInstance : (_TimerInstance = new Timer());
    }

    static start(name = 'Everything') {
        Timer.instance().start(name);
    }

    static log(name = 'Everything') {
        Timer.instance().log(name);
    }

    constructor() {
        this.times = {};
        this.start();
    }

    start(name = 'Everything') {
        this.times[name] = Date.now();
    }

    log(name = 'Everything') {
        const end = Date.now();
        const start = this.times[name];
        console.log(`UACC ${Browser.extensionVersion} ${name} took ${((end - start) / 1000).toFixed(3)} seconds`);
    }

}

Array.prototype.sum = function () {
    return this.reduce((a, b) => a + b, 0);
};

class Utils {
    static storageIds() {
        return [
            'showNonDefaultCurrencyAlert',
            'currencyLocalizationDollar',
            'currencyLocalizationAsian',
            'currencyLocalizationKroner',
            'currencyHighlightColor',
            'currencyHighlightDuration',
            'currencyUsingHighlight',
            'currencyShortcut',
            'thousandDisplay',
            'decimalDisplay',
            'decimalAmount',
            'currency',
            'currencyCustomTag',
            'currencyUsingCustomTag',
            'currencyCustomTagValue',
            'usingBlacklist',
            'blacklistingurls',
            'currencyUsingAutomatic',
            'whitelistingurls'
        ];
    }

    static get backgroundSettings() {
        return ['urlSpecificDefaultLocalization'];
    }

    /**
     * @param {string} className
     * @returns {HTMLElement[]}
     */
    static getByClass(className) {
        const temp = document.getElementsByClassName(className);
        const result = [];
        for (let i = 0; i < temp.length; i++)
            result.push(temp[i]);
        return result;
    }

    static manualStorageIds() {
        return {
            'blacklistingurls': true,
            'whitelistingurls': true,
        };
    }

    static logError(exception) {
        Utils.log('error', JSON.stringify(exception))
    }

    static log(from, data) {
        if (from !== 'error') return;
        console.log(`UACC ${from}: ${data}`);
    }

    /**
     * @param {number} number
     * @return {boolean}
     */
    static isSafeNumber(number) {
        return isFinite(number) && !isNaN(number);
    }

    /**
     * @param {number|function} time
     * @return {Promise<void>}
     */
    static wait(time = 500) {
        return (typeof time === 'number')
            ? new Promise(resolve => setTimeout(() => resolve(), time))
            : new Promise(async resolve => {
                while (!time()) await Utils.wait(250);
                resolve();
            });
    }

    /**
     * @param {string} html
     * @returns {Element}
     */
    static parseHtml(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.children[0];
    }

    /**
     * @param item
     * @return {boolean}
     */
    static isDefined(item) {
        return item !== null && (typeof item) !== 'undefined';
    }

    /**
     * @param item
     * @return {boolean}
     */
    static isUndefined(item) {
        return !Utils.isDefined(item);
    }

    /**
     * @param {function} func
     * @param {number} time
     * @return {*}
     */
    static delay(func, time = 1000) {
        return setTimeout(() => func(), time);
    }
}