import {ISetting, Setting} from "./Setting";
import {DependencyProvider} from '../DependencyInjection/DependencyInjector';

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

export class Configuration {
    readonly settings: ISetting<any>[];
    readonly disabledCurrencies: ConfigurationDisabledCurrencies;
    readonly alert: ConfigurationAlert;
    readonly localization: ConfigurationLocalisation;
    readonly whitelist: ConfigurationWhitelist;
    readonly blacklist: ConfigurationBlacklist;
    readonly currency: ConfigurationCurrency;
    readonly utility: ConfigurationUtility;
    readonly highlight: ConfigurationHighLight;
    readonly tag: ConfigurationCustomTag;
    readonly display: ConfigurationDisplay;
    readonly shortcut: ConfigurationShortcuts;
    readonly firstTime: ConfigurationFirstTime;

    constructor({
                    configurationFirstTime,
                    configurationDisabledCurrencies,
                    configurationShortcut,
                    configurationAlert,
                    configurationLocalization,
                    configurationWhitelist,
                    configurationBlacklist,
                    configurationCurrency,
                    configurationUtility,
                    configurationHighlight,
                    configurationTag,
                    configurationDisplay
                }: DependencyProvider) {
        const configs = [
            this.firstTime = configurationFirstTime,
            this.disabledCurrencies = configurationDisabledCurrencies,
            this.shortcut = configurationShortcut,
            this.alert = configurationAlert,
            this.localization = configurationLocalization,
            this.whitelist = configurationWhitelist,
            this.blacklist = configurationBlacklist,
            this.currency = configurationCurrency,
            this.utility = configurationUtility,
            this.highlight = configurationHighlight,
            this.tag = configurationTag,
            this.display = configurationDisplay,
        ];
        this.settings = configs.map(e => e.settings)
            // @ts-ignore
            .reduce((a, b) => [...a, ...b]);
    }

    async load(): Promise<void> {
        await Promise.all(this.settings.map(e => e.load()))
    }

    async save(): Promise<void> {
        await Promise.all(this.settings.map(e => e.save()));
    }
}

export class ConfigurationFirstTime {
    readonly isFirstTime: Setting<boolean>;

    constructor({browser, logger}: DependencyProvider) {
        this.isFirstTime = new Setting<boolean>(
            'showFirstTimeGuide',
            true,
            isBool,
            browser,
            logger);
    }

    get settings() {
        return [this.isFirstTime]
    }
}

export class ConfigurationDisabledCurrencies {
    readonly tags: Setting<string[]>;

    constructor({browser, logger}: DependencyProvider) {
        this.tags = new Setting<string[]>(
            'disabledCurrencies',
            [],
            array => isArrayWithRegexMatch(array, /^[A-Z]{3}$/) && isDistinctArray(array),
            browser,
            logger);
    }

    get settings() {
        return [this.tags]
    }
}

export class ConfigurationDisplay {
    readonly rounding: Setting<number>;
    readonly thousands: Setting<string>;
    readonly decimal: Setting<string>;

    constructor({browser, logger}: DependencyProvider) {
        this.rounding = new Setting<number>(
            'decimalAmount',
            2,
            isPositiveInt,
            browser,
            logger);
        this.thousands = new Setting<string>(
            'thousandDisplay',
            ' ',
            e => hasLengthRange(e, 0, 1),
            browser,
            logger);
        this.decimal = new Setting<string>(
            'decimalDisplay',
            '.',
            e => hasLength(e, 1),
            browser,
            logger);
    }

    get settings() {
        return [this.rounding, this.thousands, this.decimal]
    }
}

export class ConfigurationCustomTag {
    readonly display: Setting<string>;
    readonly value: Setting<number>;
    readonly using: Setting<boolean>;

    constructor({browser, logger}: DependencyProvider) {
        this.display = new Setting<string>(
            'currencyCustomTag',
            '$¤',
            e => hasRegexMatch(e, /.*¤.*/),
            browser,
            logger);
        this.value = new Setting<number>(
            'currencyCustomTagValue',
            1,
            isNumber,
            browser,
            logger);
        this.using = new Setting<boolean>(
            'currencyUsingCustomTag',
            false,
            isBool,
            browser,
            logger);
    }

    get settings() {
        return [this.using, this.display, this.value]
    }
}

export class ConfigurationHighLight {
    readonly using: Setting<boolean>;
    readonly color: Setting<string>;
    readonly duration: Setting<number>;

    constructor({browser, logger}: DependencyProvider) {
        this.color = new Setting<string>(
            'currencyHighlightColor',
            'yellow',
            e => {
                const div = document.createElement('div');
                div.style.backgroundColor = e + '';
                return !!div.style.backgroundColor
            },
            browser,
            logger);
        this.duration = new Setting<number>(
            'currencyHighlightDuration',
            500,
            isPositiveInt,
            browser,
            logger);
        this.using = new Setting<boolean>(
            'currencyUsingHighlight',
            true,
            isBool,
            browser,
            logger);
    }

    get settings() {
        return [this.using, this.color, this.duration]
    }
}

export class ConfigurationBlacklist {
    readonly using: Setting<boolean>;
    readonly urls: Setting<string[]>;

    constructor({browser, logger}: DependencyProvider) {
        this.using = new Setting<boolean>(
            'usingBlacklist',
            true,
            e => isBool(e),
            browser,
            logger);
        this.urls = new Setting<string[]>(
            'blacklistingurls',
            [],
            array => isStringArray(array) && isDistinctArray(array),
            browser,
            logger);
    }

    get settings() {
        return [this.using, this.urls]
    }
}

export class ConfigurationWhitelist {
    readonly using: Setting<boolean>;
    readonly urls: Setting<string[]>;

    constructor({browser, logger}: DependencyProvider) {
        this.using = new Setting<boolean>(
            'usingWhitelist',
            false,
            isBool,
            browser,
            logger);
        this.urls = new Setting<string[]>(
            'whitelistingurls',
            [],
            array => isStringArray(array) && isDistinctArray(array),
            browser,
            logger);
    }

    get settings() {
        return [this.using, this.urls]
    }
}

export class ConfigurationLocalisation {
    readonly krone: Setting<string>;
    readonly dollar: Setting<string>;
    readonly asian: Setting<string>;

    constructor({browser, logger}: DependencyProvider) {
        this.dollar = new Setting<string>(
            'currencyLocalizationDollar',
            'USD',
            e => hasLength(e, 3),
            browser,
            logger);

        this.asian = new Setting<string>(
            'currencyLocalizationAsian',
            'JPY',
            e => hasLength(e, 3),
            browser,
            logger);

        this.krone = new Setting<string>(
            'currencyLocalizationKroner',
            'SEK',
            e => hasLength(e, 3),
            browser,
            logger)
    }

    get settings() {
        return [this.dollar, this.asian, this.krone];
    }
}

export class ConfigurationAlert {
    readonly localization: Setting<boolean>;

    constructor({browser, logger}: DependencyProvider) {
        this.localization = new Setting<boolean>(
            'showNonDefaultCurrencyAlert',
            true,
            isBool,
            browser,
            logger);
    }

    get settings() {
        return [this.localization]
    }
}

export class ConfigurationCurrency {
    readonly tag: Setting<string>;
    readonly showInBrackets: Setting<boolean>;

    constructor({browser, logger}: DependencyProvider) {
        this.tag = new Setting<string>(
            'currency',
            'USD',
            e => hasLength(e, 3),
            browser,
            logger);
        this.showInBrackets = new Setting<boolean>(
            'uacc:currency:brackets',
            false,
            isBool,
            browser,
            logger
        );
    }

    get settings() {
        return [this.tag, this.showInBrackets];
    }
}

export class ConfigurationShortcuts {
    readonly convertHover: Setting<string>;
    readonly convertAll: Setting<string>;

    constructor({browser, logger}: DependencyProvider) {
        this.convertHover = new Setting<string>(
            'currencyShortcut',
            'Shift',
            isString,
            browser,
            logger);

        this.convertAll = new Setting<string>(
            'shortcut:convert:all',
            '',
            isString,
            browser,
            logger);
    }

    get settings() {
        return [this.convertHover, this.convertAll]
    }
}

export class ConfigurationUtility {
    readonly click: Setting<boolean>;
    readonly using: Setting<boolean>;
    readonly hover: Setting<boolean>;

    constructor({browser, logger}: DependencyProvider) {
        this.click = new Setting<boolean>(
            'utilityClickConvert',
            true,
            isBool,
            browser,
            logger
        );
        this.using = new Setting<boolean>(
            'currencyUsingAutomatic',
            true,
            isBool,
            browser,
            logger);
        this.hover = new Setting<boolean>(
            'utilityHoverConvert',
            false,
            isBool,
            browser,
            logger);
    }

    get settings() {
        return [this.using, this.hover, this.click]
    }
}

