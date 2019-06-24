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

class Utils {
    static storageIds() {
        return [
            'currencyHighlightColor',
            'currencyHighlightDuration',
            'currencyUsingHighlight',
            'currencyShortcut',
            'usingCurrencyConverter',
            'thousandDisplay',
            'decimalDisplay',
            'decimalAmount',
            'currency',
            'currencyCustomTag',
            'currencyUsingCustomTag',
            'currencyCustomTagValue',
            'usingBlacklist',
            'blacklistingurls',
            'currencyUsingAutomatic'
        ];
    }

    static initiateCheckboxes(){
        const checkboxes = document.getElementsByClassName('custom-check');
        for (let i = 0; i < checkboxes.length; i++) {
            const box = checkboxes[i];
            if (Utils.isDefined(box.checked)) return;
            box.checked = false;
            box.change = (value = !box.checked) => {
                if (value === box.checked) return;
                box.checked = !!value;
                if (box.checked)
                    box.classList.add('custom-check-checked');
                else
                    box.classList.remove('custom-check-checked');
                box.dispatchEvent(new Event('change'));
            };
            box.addEventListener('click', () => box.change());
        }
    }

    static manualStorageIds() {
        return {'blacklistingurls': true};
    }

    static logError(exception) {
        Utils.log('error', JSON.stringify(exception))
    }

    static log(from, data) {
        if(from !== 'error') return;
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