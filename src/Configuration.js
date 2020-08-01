let _configurationInstance = null;

const isBool = e => typeof (e) === 'boolean';

const isNumber = e => !isNaN(Number(e)) && Number.isFinite(Number(e));
const isInt = e => isNumber(e) && Math.floor(Number(e)) === Number(e);
const isPositive = e => isNumber(e) && Number(e) >= 0;
const isPositiveInt = e => isPositive(e) && isInt(e);

const isString = e => typeof (e) === 'string';
const hasLength = (e, length) => isString(e) && e.length === length;
const hasLengthRange = (e, min, max) => isString(e) && min <= e.length && e.length <= max;
const hasRegexMatch = (e, match) => isString(e) && match.test(e);

const isArray = e => Array.isArray(e);
const isDistinctArray = e => isArray(e) && (new Set(e)).size === e.length
const isStringArray = e => isArray(e) && e.every(isString);
const isArrayWithRegexMatch = (e, match) => isArray(e) && e.every(a => hasRegexMatch(a, match))

class Configuration {
    /**
     * @returns {Configuration}
     */
    static get instance() {
        if (_configurationInstance === null) _configurationInstance = new Configuration();
        return _configurationInstance;
    }

    /**
     * @returns {Promise<void>}
     */
    async load() {
        const keys = this.settings.map(e => e.storageKey);
        const data = await this._browser.loadSync(keys);
        if (!data) return;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            this.byStorageKey[key].setValue(data[key]);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async save() {
        const data = {};
        for (let i = 0; i < this.settings.length; i++) {
            const setting = this.settings[i];
            data[setting.storageKey] = setting.value;
        }
        await this._browser.saveSync(data, null);
    }

    /**
     * @param {{browser: Browser}} services
     */
    constructor(services = {}) {
        this._browser = services.browser || Browser.instance;
        const self = this;
        const configs = [
            self.disabledCurrencies = new DisabledCurrencies(),
            self.alert = new ConfigurationAlert(),
            self.localization = new ConfigurationLocalisation(),
            self.whitelist = new ConfigurationWhitelist(),
            self.blacklist = new ConfigurationBlacklist(),
            self.currency = new ConfigurationCurrency(),
            self.utility = new ConfigurationUtility(),
            self.highlight = new ConfigurationHighLight(),
            self.tag = new ConfigurationCustomTag(),
            self.display = new ConfigurationDisplay(),
        ];
        this.settings = configs.map(e => e.settings).flatMap(e => e);
        this.byStorageKey = {};
        this.byHtmlId = {};
        for (let i in this.settings) {
            const setting = this.settings[i];
            this.byStorageKey[setting.storageKey] = setting;
            this.byHtmlId[setting.htmlId] = setting;
        }
    }
}

class DisabledCurrencies {
    constructor() {
        this.tags = new Setting(
            '',
            'disabledCurrencies',
            [],
            array => isArrayWithRegexMatch(array, /^[A-Z]{3}$/) && isDistinctArray(array));
        this.settings = [this.tags];
    }
}

class ConfigurationDisplay {
    constructor() {
        this.rounding = new Setting(
            '',
            'decimalAmount',
            2,
            isPositiveInt);
        this.thousands = new Setting(
            '',
            'thousandDisplay',
            ' ',
            e => hasLengthRange(e, 0, 1));
        this.decimal = new Setting(
            '',
            'decimalDisplay',
            '.',
            e => hasLength(e, 1));
        this.settings = [this.rounding, this.thousands, this.decimal];
    }
}

class ConfigurationCustomTag {
    constructor() {
        this.display = new Setting(
            '',
            'currencyCustomTag',
            ' ¤',
            isString);
        this.value = new Setting(
            '',
            'currencyCustomTagValue',
            1,
            isNumber);
        this.using = new Setting(
            '',
            'currencyUsingCustomTag',
            false,
            isBool);
        this.settings = [this.using, this.display, this.value];
    }
}

class ConfigurationHighLight {
    constructor() {
        this.color = new Setting(
            '',
            'currencyHighlightColor',
            'yellow',
            e => {
                const div = document.createElement('div');
                div.style.backgroundColor = e + '';
                return !!div.style.backgroundColor
            });
        this.duration = new Setting(
            '',
            'currencyHighlightDuration',
            500,
            isPositiveInt);
        this.using = new Setting(
            '',
            'currencyUsingHighlight',
            true,
            isBool);
        this.settings = [this.using, this.color, this.duration];
    }
}

class ConfigurationBlacklist {
    constructor() {
        this.using = new Setting(
            '',
            'usingBlacklist',
            true,
            e => isBool(e));
        this.urls = new Setting(
            '',
            'blacklistingurls',
            [],
            array => isStringArray(array) && isDistinctArray(array));
        this.settings = [this.using, this.urls];
    }
}

class ConfigurationWhitelist {
    constructor() {
        this.using = new Setting(
            '',
            'usingWhitelist',
            false,
            isBool);
        this.urls = new Setting(
            '',
            'whitelistingurls',
            [],
            array => isStringArray(array) && isDistinctArray(array));
        this.settings = [this.using, this.urls];
    }
}

class ConfigurationLocalisation {
    constructor() {
        this.dollar = new Setting(
            '',
            'currencyLocalizationDollar',
            'USD',
            e => hasLength(e, 3));

        this.asian = new Setting(
            '',
            'currencyLocalizationAsian',
            'JPY',
            e => hasLength(e, 3));

        this.krone = new Setting(
            '',
            'currencyLocalizationKroner',
            'SEK',
            e => hasLength(e, 3))

        this.settings = [this.dollar, this.asian, this.krone];
    }
}

class ConfigurationAlert {
    constructor() {
        this.localization = new Setting(
            '',
            'showNonDefaultCurrencyAlert',
            true,
            isBool);
        this.settings = [this.localization];
    }
}

class ConfigurationCurrency {
    constructor() {
        this.tag = new Setting(
            '',
            'currency',
            'USD',
            e => hasLength(e, 3));
        this.showInBrackets = new Setting(
            '',
            'uacc:currency:brackets',
            false,
            isBool
        );
        this.settings = [this.tag, this.showInBrackets];
    }
}

class ConfigurationUtility {
    constructor() {
        this.click = new Setting(
            '',
            'utilityClickConvert',
            true,
            isBool
        );
        this.using = new Setting(
            '',
            'currencyUsingAutomatic',
            true,
            isBool);
        this.shortcut = new Setting(
            '',
            'currencyShortcut',
            'Shift',
            isString);
        this.hover = new Setting(
            '',
            'utilityHoverConvert',
            false,
            isBool);
        this.settings = [this.using, this.shortcut, this.hover, this.click];
    }
}

class Setting {
    /**
     * @param {string} htmlId
     * @param {string} storageKey
     * @param {*} defaultValue
     * @param {function(value):boolean} validation
     */
    constructor(htmlId, storageKey, defaultValue, validation = () => true) {
        this._storageKey = storageKey;
        this._validation = validation;
        this._defaultValue = defaultValue;
        this._htmlId = htmlId;
        this._value = defaultValue;
    }

    /**
     * @returns {string}
     */
    get htmlId() {
        return this._htmlId;
    }

    /**
     * @returns {string}
     */
    get storageKey() {
        return this._storageKey;
    }

    /**
     * @returns {*}
     */
    get value() {
        return this._value;
    }

    /**
     * @returns {*}
     */
    get default() {
        return this._defaultValue;
    }

    /**
     * Returns whether or not the value is valid and set
     * @param value
     * @returns {boolean}
     */
    setValue(value) {
        if (!this._validation(value)) return false;
        if (typeof (this._defaultValue) === 'number')
            this._value = Number(value);
        else
            this._value = value;
        return true;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async save() {
        const browser = Browser.instance;
        await browser.saveSync(this.storageKey, this.value);
    }

    /**
     * Returns boolean if the loaded value was valid
     * @returns {Promise<boolean>}
     */
    async load() {
        const browser = Browser.instance;
        const loaded = await browser.loadSync(this.storageKey);
        if (!loaded) return false;
        return this.setValue(loaded[this.storageKey]);
    }
}