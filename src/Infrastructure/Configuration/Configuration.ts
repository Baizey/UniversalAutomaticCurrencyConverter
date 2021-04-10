import {Browser, IBrowser} from "../";
import {Setting, ISetting} from "./Setting";

const isBool = (e: any) => typeof (e) === 'boolean';

const isNumber = (e: any) => !isNaN(Number(e)) && Number.isFinite(Number(e));
const isInt = (e: any) => isNumber(e) && Math.floor(Number(e)) === Number(e);
const isPositive = (e: any) => isNumber(e) && Number(e) >= 0;
const isPositiveInt = (e: any) => isPositive(e) && isInt(e);

const isString = (e: any) => typeof (e) === 'string';
const hasLength = (e: any, length: number) => isString(e) && e.length === length;
const hasLengthRange = (e: any, min: number, max: number) => isString(e) && min <= e.length && e.length <= max;
const hasRegexMatch = (e: any, match: RegExp) => isString(e) && match.test(e);

const isArray = (e: any) => Array.isArray(e);
const isDistinctArray = (e: any) => isArray(e) && (new Set(e)).size === e.length
const isStringArray = (e: any) => isArray(e) && e.every(isString);
const isArrayWithRegexMatch = (e: any, match: RegExp) => isArray(e) && e.every((a: any) => hasRegexMatch(a, match))

export type ConfigurationInjection = {
    browser?: Browser
}

export class Configuration {
    private static _instance: Configuration;
    private browser: IBrowser;
    readonly settings: ISetting<any>[];
    readonly byStorageKey: { [key: string]: ISetting<any> }
    readonly byHtmlId: { [key: string]: ISetting<any> }
    private disabledCurrencies: DisabledCurrencies;
    private alert: ConfigurationAlert;
    readonly localization: ConfigurationLocalisation;
    private whitelist: ConfigurationWhitelist;
    private blacklist: ConfigurationBlacklist;
    private currency: ConfigurationCurrency;
    private utility: ConfigurationUtility;
    private highlight: ConfigurationHighLight;
    private tag: ConfigurationCustomTag;
    private display: ConfigurationDisplay;

    static instance(config?: Configuration): Configuration {
        if (config) this._instance = config;
        if (!this._instance) this._instance = new Configuration();
        return this._instance;
    }

    constructor(injection: ConfigurationInjection = {}) {
        this.browser = injection.browser || Browser.instance();
        const configs = [
            this.disabledCurrencies = new DisabledCurrencies(injection),
            this.alert = new ConfigurationAlert(injection),
            this.localization = new ConfigurationLocalisation(injection),
            this.whitelist = new ConfigurationWhitelist(injection),
            this.blacklist = new ConfigurationBlacklist(injection),
            this.currency = new ConfigurationCurrency(injection),
            this.utility = new ConfigurationUtility(injection),
            this.highlight = new ConfigurationHighLight(injection),
            this.tag = new ConfigurationCustomTag(injection),
            this.display = new ConfigurationDisplay(injection),
        ];
        this.settings = configs.map(e => e.settings)
            // @ts-ignore
            .reduce((a, b) => [...a, ...b]);
        this.byStorageKey = {};
        this.byHtmlId = {};
        for (let i in this.settings) {
            const setting = this.settings[i];
            this.byStorageKey[setting.storageKey] = setting;
            this.byHtmlId[setting.htmlId] = setting;
        }
    }

    async load(): Promise<void> {
        await Promise.all(this.settings.map(e => e.load()))
    }

    async save(): Promise<void> {
        await Promise.all(this.settings.map(e => e.save()));
    }
}

class DisabledCurrencies {
    readonly tags: Setting<string[]>;

    constructor(injection: ConfigurationInjection = {}) {
        this.tags = new Setting<string[]>(
            '',
            'disabledCurrencies',
            [],
            array => isArrayWithRegexMatch(array, /^[A-Z]{3}$/) && isDistinctArray(array),
            injection);
    }

    get settings() {
        return [this.tags]
    }
}

class ConfigurationDisplay {
    readonly rounding: Setting<number>;
    readonly thousands: Setting<string>;
    readonly decimal: Setting<string>;

    constructor(injection: ConfigurationInjection = {}) {
        this.rounding = new Setting<number>(
            '',
            'decimalAmount',
            2,
            isPositiveInt,
            injection);
        this.thousands = new Setting<string>(
            '',
            'thousandDisplay',
            ' ',
            e => hasLengthRange(e, 0, 1),
            injection);
        this.decimal = new Setting<string>(
            '',
            'decimalDisplay',
            '.',
            e => hasLength(e, 1),
            injection);
    }

    get settings() {
        return [this.rounding, this.thousands, this.decimal]
    }
}

class ConfigurationCustomTag {
    readonly display: Setting<string>;
    readonly value: Setting<number>;
    readonly using: Setting<boolean>;

    constructor(injection: ConfigurationInjection = {}) {
        this.display = new Setting<string>(
            '',
            'currencyCustomTag',
            ' ¤',
            isString,
            injection);
        this.value = new Setting<number>(
            '',
            'currencyCustomTagValue',
            1,
            isNumber,
            injection);
        this.using = new Setting<boolean>(
            '',
            'currencyUsingCustomTag',
            false,
            isBool,
            injection);
    }

    get settings() {
        return [this.using, this.display, this.value]
    }
}

class ConfigurationHighLight {
    readonly using: Setting<boolean>;
    readonly color: Setting<string>;
    readonly duration: Setting<number>;

    constructor(injection: ConfigurationInjection = {}) {
        this.color = new Setting<string>(
            '',
            'currencyHighlightColor',
            'yellow',
            e => {
                const div = document.createElement('div');
                div.style.backgroundColor = e + '';
                return !!div.style.backgroundColor
            },
            injection);
        this.duration = new Setting<number>(
            '',
            'currencyHighlightDuration',
            500,
            isPositiveInt,
            injection);
        this.using = new Setting<boolean>(
            '',
            'currencyUsingHighlight',
            true,
            isBool,
            injection);
    }

    get settings() {
        return [this.using, this.color, this.duration]
    }
}

class ConfigurationBlacklist {
    readonly using: Setting<boolean>;
    readonly urls: Setting<string[]>;

    constructor(injection: ConfigurationInjection = {}) {
        this.using = new Setting<boolean>(
            '',
            'usingBlacklist',
            true,
            e => isBool(e),
            injection);
        this.urls = new Setting<string[]>(
            '',
            'blacklistingurls',
            [],
            array => isStringArray(array) && isDistinctArray(array),
            injection);
    }

    get settings() {
        return [this.using, this.urls]
    }
}

class ConfigurationWhitelist {
    readonly using: Setting<boolean>;
    readonly urls: Setting<string[]>;

    constructor(injection: ConfigurationInjection = {}) {
        this.using = new Setting<boolean>(
            '',
            'usingWhitelist',
            false,
            isBool,
            injection);
        this.urls = new Setting<string[]>(
            '',
            'whitelistingurls',
            [],
            array => isStringArray(array) && isDistinctArray(array),
            injection);
    }

    get settings() {
        return [this.using, this.urls]
    }
}

class ConfigurationLocalisation {
    readonly krone: Setting<string>;
    readonly dollar: Setting<string>;
    readonly asian: Setting<string>;

    constructor(injection: ConfigurationInjection = {}) {
        this.dollar = new Setting<string>(
            '',
            'currencyLocalizationDollar',
            'USD',
            e => hasLength(e, 3),
            injection);

        this.asian = new Setting<string>(
            '',
            'currencyLocalizationAsian',
            'JPY',
            e => hasLength(e, 3),
            injection);

        this.krone = new Setting<string>(
            '',
            'currencyLocalizationKroner',
            'SEK',
            e => hasLength(e, 3),
            injection)
    }

    get settings() {
        return [this.dollar, this.asian, this.krone];
    }
}

class ConfigurationAlert {
    readonly localization: Setting<boolean>;

    constructor(injection: ConfigurationInjection = {}) {
        this.localization = new Setting<boolean>(
            '',
            'showNonDefaultCurrencyAlert',
            true,
            isBool,
            injection);
    }

    get settings() {
        return [this.localization]
    }
}

class ConfigurationCurrency {
    readonly tag: Setting<string>;
    readonly showInBrackets: Setting<boolean>;

    constructor(injection: ConfigurationInjection = {}) {
        this.tag = new Setting<string>(
            '',
            'currency',
            'USD',
            e => hasLength(e, 3),
            injection);
        this.showInBrackets = new Setting<boolean>(
            '',
            'uacc:currency:brackets',
            false,
            isBool,
            injection
        );
    }

    get settings() {
        return [this.tag, this.showInBrackets];
    }
}

class ConfigurationUtility {
    readonly click: Setting<boolean>;
    readonly using: Setting<boolean>;
    readonly shortcut: Setting<string>;
    readonly hover: Setting<boolean>;

    constructor(injection: ConfigurationInjection = {}) {
        this.click = new Setting<boolean>(
            '',
            'utilityClickConvert',
            true,
            isBool,
            injection
        );
        this.using = new Setting<boolean>(
            '',
            'currencyUsingAutomatic',
            true,
            isBool,
            injection);
        this.shortcut = new Setting<string>(
            '',
            'currencyShortcut',
            'Shift',
            isString,
            injection);
        this.hover = new Setting<boolean>(
            '',
            'utilityHoverConvert',
            false,
            isBool,
            injection);
    }

    get settings() {
        return [this.using, this.shortcut, this.hover, this.click]
    }
}

