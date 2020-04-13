let _configurationInstance = null;

const isBool = e => typeof (e) === 'boolean';
const isString = e => typeof (e) === 'string';
const isNumber = e => typeof (e) === 'number' && !isNaN(e) && Number.isFinite(e);
const isInt = e => isNumber(e) && Math.floor(e) === e;
const isPositive = e => isNumber(e) && e >= 0;
const hasLength = (e, length) => isString(e) && e.length === length;
const isStringArray = e => Array.isArray(e) && e.every(isString);

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
    static async load() {
        await Configuration.instance.load();
    }

    /**
     * @returns {Promise<void>}
     */
    static async save() {
        await Configuration.instance.save();
    }

    /**
     * @returns {Promise<void>}
     */
    async load() {
        const keys = this.settings.map(e => e.storageKey);
        const data = await Browser.instance().loadSync(keys);
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
        await Browser.instance().saveSync(data, null);
    }

    constructor() {
        this.alert = new ConfigurationAlert();
        this.localization = new ConfigurationLocalisation();
        this.whitelist = new ConfigurationWhitelist();
        this.blacklist = new ConfigurationBlacklist();
        this.currency = new ConfigurationCurrency();
        this.utility = new ConfigurationUtility();
        this.highlight = new ConfigurationHighLight();
        this.tag = new ConfigurationCustomTag();
        this.display = new ConfigurationDisplay();
        const configs = [
            this.alert,
            this.localization,
            this.whitelist,
            this.blacklist,
            this.currency,
            this.utility,
            this.highlight,
            this.tag,
            this.display
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

class ConfigurationDisplay {
    constructor() {
        this.rounding = new Setting(
            '',
            'decimalAmount',
            2,
            e => isInt(e) && isPositive(e));
        this.thousands = new Setting(
            '',
            'thousandDisplay',
            ' ',
            e => hasLength(e, 1));
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
            e => isInt(e) && isPositive(e));
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
            isStringArray);
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
            isStringArray);
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
        this.settings = [this.tag];
    }
}

class ConfigurationUtility {
    constructor() {
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
        this.settings = [this.using, this.shortcut, this.hover];
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
        this._value = value;
        return true;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async save() {
        const browser = Browser.instance();
        await browser.saveSync(this.storageKey, this.value);
    }

    /**
     * Returns boolean if the loaded value was valid
     * @returns {Promise<boolean>}
     */
    async load() {
        const browser = Browser.instance();
        const loaded = await browser.loadSync(this.storageKey);
        if (!loaded) return false;
        return this.setValue(loaded[this.storageKey]);
    }
}