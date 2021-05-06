import {SyncSetting} from "./SyncSetting";
import {DependencyProvider} from '../DependencyInjection/DependencyInjector';
import {ISetting} from './ISetting';
import {ThemeType} from '../../Atoms/StyleTheme';

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
    readonly theme: ThemeConfiguration;

    constructor({
                    themeConfiguration,
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
            this.theme = themeConfiguration,
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
    readonly isFirstTime: SyncSetting<boolean>;

    constructor({provider}: DependencyProvider) {
        this.isFirstTime = new SyncSetting<boolean>(
            provider,
            'showFirstTimeGuide',
            true,
            isBool);
    }

    get settings() {
        return [this.isFirstTime]
    }
}

export class ThemeConfiguration {
    readonly theme: SyncSetting<ThemeType>;

    constructor({provider}: DependencyProvider) {
        this.theme = new SyncSetting<ThemeType>(
            provider,
            'uacc:theme:selection',
            'darkTheme',
            isString)
    }

    get settings() {
        return [this.theme]
    }
}

export class ConfigurationDisabledCurrencies {
    readonly tags: SyncSetting<string[]>;

    constructor({provider}: DependencyProvider) {
        this.tags = new SyncSetting<string[]>(
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
    readonly rounding: SyncSetting<number>;
    readonly thousands: SyncSetting<string>;
    readonly decimal: SyncSetting<string>;

    constructor({provider}: DependencyProvider) {
        this.rounding = new SyncSetting<number>(
            provider,
            'decimalAmount',
            2,
            isPositiveInt);
        this.thousands = new SyncSetting<string>(
            provider,
            'thousandDisplay',
            ' ',
            e => hasLengthRange(e, 0, 1));
        this.decimal = new SyncSetting<string>(
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
    readonly display: SyncSetting<string>;
    readonly value: SyncSetting<number>;
    readonly using: SyncSetting<boolean>;

    constructor({provider}: DependencyProvider) {
        this.display = new SyncSetting<string>(
            provider,
            'currencyCustomTag',
            '$¤',
            e => hasRegexMatch(e, /.*¤.*/));
        this.value = new SyncSetting<number>(
            provider,
            'currencyCustomTagValue',
            1,
            isNumber);
        this.using = new SyncSetting<boolean>(
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
    readonly using: SyncSetting<boolean>;
    readonly color: SyncSetting<string>;
    readonly duration: SyncSetting<number>;

    constructor({provider}: DependencyProvider) {
        this.color = new SyncSetting<string>(
            provider,
            'currencyHighlightColor',
            'yellow',
            e => {
                const div = document.createElement('div');
                div.style.backgroundColor = e + '';
                return !!div.style.backgroundColor
            });
        this.duration = new SyncSetting<number>(
            provider,
            'currencyHighlightDuration',
            500,
            isPositiveInt);
        this.using = new SyncSetting<boolean>(
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
    readonly using: SyncSetting<boolean>;
    readonly urls: SyncSetting<string[]>;

    constructor({provider}: DependencyProvider) {
        this.using = new SyncSetting<boolean>(
            provider,
            'usingBlacklist',
            true,
            e => isBool(e));
        this.urls = new SyncSetting<string[]>(
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
    readonly using: SyncSetting<boolean>;
    readonly urls: SyncSetting<string[]>;

    constructor({provider}: DependencyProvider) {
        this.using = new SyncSetting<boolean>(
            provider,
            'usingWhitelist',
            false,
            isBool);
        this.urls = new SyncSetting<string[]>(
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
    readonly krone: SyncSetting<string>;
    readonly dollar: SyncSetting<string>;
    readonly asian: SyncSetting<string>;

    constructor({provider}: DependencyProvider) {
        this.dollar = new SyncSetting<string>(
            provider,
            'currencyLocalizationDollar',
            'USD',
            e => hasLength(e, 3));

        this.asian = new SyncSetting<string>(
            provider,
            'currencyLocalizationAsian',
            'JPY',
            e => hasLength(e, 3));

        this.krone = new SyncSetting<string>(
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
    readonly localization: SyncSetting<boolean>;

    constructor({provider}: DependencyProvider) {
        this.localization = new SyncSetting<boolean>(
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
    readonly tag: SyncSetting<string>;
    readonly showInBrackets: SyncSetting<boolean>;

    constructor({provider}: DependencyProvider) {
        this.tag = new SyncSetting<string>(
            provider,
            'currency',
            'USD',
            e => hasLength(e, 3));
        this.showInBrackets = new SyncSetting<boolean>(
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
    readonly convertHover: SyncSetting<string>;
    readonly convertAll: SyncSetting<string>;

    constructor({provider}: DependencyProvider) {
        this.convertHover = new SyncSetting<string>(
            provider,
            'currencyShortcut',
            'Shift',
            isString);

        this.convertAll = new SyncSetting<string>(
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
    readonly click: SyncSetting<boolean>;
    readonly using: SyncSetting<boolean>;
    readonly hover: SyncSetting<boolean>;

    constructor({provider}: DependencyProvider) {
        this.click = new SyncSetting<boolean>(
            provider,
            'utilityClickConvert',
            true,
            isBool
        );
        this.using = new SyncSetting<boolean>(
            provider,
            'currencyUsingAutomatic',
            true,
            isBool);
        this.hover = new SyncSetting<boolean>(
            provider,
            'utilityHoverConvert',
            false,
            isBool);
    }

    get settings() {
        return [this.using, this.hover, this.click]
    }
}

