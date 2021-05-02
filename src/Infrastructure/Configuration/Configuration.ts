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

    constructor({provider}: DependencyProvider) {
        this.isFirstTime = new Setting<boolean>(
            provider,
            'showFirstTimeGuide',
            true,
            isBool);
    }

    get settings() {
        return [this.isFirstTime]
    }
}

export class ConfigurationDisabledCurrencies {
    readonly tags: Setting<string[]>;

    constructor({provider}: DependencyProvider) {
        this.tags = new Setting<string[]>(
            provider,
            'disabledCurrencies',
            [],
            array => isArrayWithRegexMatch(array, /^[A-Z]{3}$/) && isDistinctArray(array));
    }

    get settings() {
        return [this.tags]
    }
}

export class ConfigurationDisplay {
    readonly rounding: Setting<number>;
    readonly thousands: Setting<string>;
    readonly decimal: Setting<string>;

    constructor({provider}: DependencyProvider) {
        this.rounding = new Setting<number>(
            provider,
            'decimalAmount',
            2,
            isPositiveInt);
        this.thousands = new Setting<string>(
            provider,
            'thousandDisplay',
            ' ',
            e => hasLengthRange(e, 0, 1));
        this.decimal = new Setting<string>(
            provider,
            'decimalDisplay',
            '.',
            e => hasLength(e, 1));
    }

    get settings() {
        return [this.rounding, this.thousands, this.decimal]
    }
}

export class ConfigurationCustomTag {
    readonly display: Setting<string>;
    readonly value: Setting<number>;
    readonly using: Setting<boolean>;

    constructor({provider}: DependencyProvider) {
        this.display = new Setting<string>(
            provider,
            'currencyCustomTag',
            '$¤',
            e => hasRegexMatch(e, /.*¤.*/));
        this.value = new Setting<number>(
            provider,
            'currencyCustomTagValue',
            1,
            isNumber);
        this.using = new Setting<boolean>(
            provider,
            'currencyUsingCustomTag',
            false,
            isBool);
    }

    get settings() {
        return [this.using, this.display, this.value]
    }
}

export class ConfigurationHighLight {
    readonly using: Setting<boolean>;
    readonly color: Setting<string>;
    readonly duration: Setting<number>;

    constructor({provider}: DependencyProvider) {
        this.color = new Setting<string>(
            provider,
            'currencyHighlightColor',
            'yellow',
            e => {
                const div = document.createElement('div');
                div.style.backgroundColor = e + '';
                return !!div.style.backgroundColor
            });
        this.duration = new Setting<number>(
            provider,
            'currencyHighlightDuration',
            500,
            isPositiveInt);
        this.using = new Setting<boolean>(
            provider,
            'currencyUsingHighlight',
            true,
            isBool);
    }

    get settings() {
        return [this.using, this.color, this.duration]
    }
}

export class ConfigurationBlacklist {
    readonly using: Setting<boolean>;
    readonly urls: Setting<string[]>;

    constructor({provider}: DependencyProvider) {
        this.using = new Setting<boolean>(
            provider,
            'usingBlacklist',
            true,
            e => isBool(e));
        this.urls = new Setting<string[]>(
            provider,
            'blacklistingurls',
            [],
            array => isStringArray(array) && isDistinctArray(array));
    }

    get settings() {
        return [this.using, this.urls]
    }
}

export class ConfigurationWhitelist {
    readonly using: Setting<boolean>;
    readonly urls: Setting<string[]>;

    constructor({provider}: DependencyProvider) {
        this.using = new Setting<boolean>(
            provider,
            'usingWhitelist',
            false,
            isBool);
        this.urls = new Setting<string[]>(
            provider,
            'whitelistingurls',
            [],
            array => isStringArray(array) && isDistinctArray(array));
    }

    get settings() {
        return [this.using, this.urls]
    }
}

export class ConfigurationLocalisation {
    readonly krone: Setting<string>;
    readonly dollar: Setting<string>;
    readonly asian: Setting<string>;

    constructor({provider}: DependencyProvider) {
        this.dollar = new Setting<string>(
            provider,
            'currencyLocalizationDollar',
            'USD',
            e => hasLength(e, 3));

        this.asian = new Setting<string>(
            provider,
            'currencyLocalizationAsian',
            'JPY',
            e => hasLength(e, 3));

        this.krone = new Setting<string>(
            provider,
            'currencyLocalizationKroner',
            'SEK',
            e => hasLength(e, 3))
    }

    get settings() {
        return [this.dollar, this.asian, this.krone];
    }
}

export class ConfigurationAlert {
    readonly localization: Setting<boolean>;

    constructor({provider}: DependencyProvider) {
        this.localization = new Setting<boolean>(
            provider,
            'showNonDefaultCurrencyAlert',
            true,
            isBool);
    }

    get settings() {
        return [this.localization]
    }
}

export class ConfigurationCurrency {
    readonly tag: Setting<string>;
    readonly showInBrackets: Setting<boolean>;

    constructor({provider}: DependencyProvider) {
        this.tag = new Setting<string>(
            provider,
            'currency',
            'USD',
            e => hasLength(e, 3));
        this.showInBrackets = new Setting<boolean>(
            provider,
            'uacc:currency:brackets',
            false,
            isBool
        );
    }

    get settings() {
        return [this.tag, this.showInBrackets];
    }
}

export class ConfigurationShortcuts {
    readonly convertHover: Setting<string>;
    readonly convertAll: Setting<string>;

    constructor({provider}: DependencyProvider) {
        this.convertHover = new Setting<string>(
            provider,
            'currencyShortcut',
            'Shift',
            isString);

        this.convertAll = new Setting<string>(
            provider,
            'shortcut:convert:all',
            '',
            isString);
    }

    get settings() {
        return [this.convertHover, this.convertAll]
    }
}

export class ConfigurationUtility {
    readonly click: Setting<boolean>;
    readonly using: Setting<boolean>;
    readonly hover: Setting<boolean>;

    constructor({provider}: DependencyProvider) {
        this.click = new Setting<boolean>(
            provider,
            'utilityClickConvert',
            true,
            isBool
        );
        this.using = new Setting<boolean>(
            provider,
            'currencyUsingAutomatic',
            true,
            isBool);
        this.hover = new Setting<boolean>(
            provider,
            'utilityHoverConvert',
            false,
            isBool);
    }

    get settings() {
        return [this.using, this.hover, this.click]
    }
}

