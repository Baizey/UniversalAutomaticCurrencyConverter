import {SyncSetting} from "./SyncSetting";
import {ISetting} from './ISetting';
import {LocalSetting} from './LocalSetting';
import {DependencyProvider} from '../DependencyInjection';
import {themes} from '../Theme';
import {SiteAllowance} from "../../currencyConverter/Detection";

const isBool = (e: any) => typeof (e) === 'boolean';

const isNumber = (e: any) => !isNaN(Number(e)) && Number.isFinite(Number(e));
const isInt = (e: any) => isNumber(e) && Math.floor(Number(e)) === Number(e);
const isPositive = (e: any) => isNumber(e) && Number(e) >= 0;
const isPositiveInt = (e: any) => isPositive(e) && isInt(e);

const isString = (e: any) => typeof (e) === 'string';
const isOneOf = (e: any, arr: any[]) => arr.indexOf(e) >= 0;
const hasLength = (e: any, length: number) => isString(e) && e.length === length;
const hasLengthRange = (e: any, min: number, max: number) => isString(e) && min <= e.length && e.length <= max;
const hasRegexMatch = (e: any, match: RegExp) => isString(e) && match.test(e);

const isArray = (e: any) => Array.isArray(e);
const isDistinctArray = (e: any) => isArray(e) && (new Set(e)).size === e.length
const isStringArray = (e: any) => isArray(e) && e.every(isString);
const isArrayWithRegexMatch = (e: any, match: RegExp) => isArray(e) && e.every((a: any) => hasRegexMatch(a, match))

export class Configuration {
    readonly settings: ISetting<any>[];

    constructor({allSettings}: DependencyProvider) {
        this.settings = allSettings;
    }

    async load(): Promise<void> {
        await Promise.all(this.settings.map(e => e.loadSetting()))
    }
}

type MiniConverterRow = {
    from: string,
    to: string,
    amount: number
}

export class LastVersionSetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'lastVersion', '0.0.0', e => hasRegexMatch(e, /^\d+\.\d+\.\d+$/));
    }
}

export class miniConverterSetting extends LocalSetting<MiniConverterRow[]> {
    constructor(provider: DependencyProvider) {
        super(provider, 'uacc:global:converter', [], isArray);
    }
}


export class isFirstTimeSetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'showFirstTimeGuide', true, isBool);
    }
}

export class colorThemeSetting extends SyncSetting<keyof typeof themes> {
    constructor(provider: DependencyProvider) {
        super(provider, 'uacc:theme:selection', 'darkTheme', isString);
    }
}

export class disabledCurrenciesSetting extends SyncSetting<string[]> {
    constructor(provider: DependencyProvider) {
        super(
            provider,
            'disabledCurrencies',
            [],
            array => isArrayWithRegexMatch(array, /^[A-Z]{3}$/) && isDistinctArray(array));
    }
}

export class significantDigitsSetting extends SyncSetting<number> {
    constructor(provider: DependencyProvider) {
        super(provider, 'decimalAmount', 2, isPositiveInt);
    }
}

export class thousandsSeparatorSetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'thousandDisplay', ' ', e => hasLengthRange(e, 0, 1));
    }
}

export class decimalPointSetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'decimalDisplay', '.', () => true);
    }
}

export class conversionDisplaySetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyCustomTag', '$¤', e => hasRegexMatch(e, /.*¤.*/));
    }
}

export class customConversionRateSetting extends SyncSetting<number> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyCustomTagValue', 1, isNumber)
    }
}

export class usingCustomDisplaySetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyUsingCustomTag', false, isBool)
    }
}

export class highlightColorSetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyHighlightColor', 'yellow', e => {
            const div = provider.browser.document.createElement('div');
            div.style.backgroundColor = e + '';
            return !!div.style.backgroundColor
        });
    }
}

export class IsPausedSetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'uacc:pause', false, isBool)
    }
}

export type LoggingSettingType = 'error' | 'info' | ' debug' | 'nothing'

export class useDebugLoggingSetting extends SyncSetting<LoggingSettingType> {
    constructor(provider: DependencyProvider) {
        super(provider, 'uacc:debug:logging', 'error', e => isOneOf(e, ['error', 'info', 'debug', 'nothing']))
    }
}

export class highlightDurationSetting extends SyncSetting<number> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyHighlightDuration', 500, isPositiveInt)
    }
}

export class usingConversionHighlightingSetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyUsingHighlight', true, isBool)
    }
}

export class usingBlacklistingSetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'usingBlacklist', true, e => isBool(e))
    }
}

class UrlSettingsBase extends SyncSetting<string[]> {
    constructor(provider: DependencyProvider, key: string) {
        super(provider, key, [], array => isStringArray(array))
    }

    parseUri(raw: string) {
        try {
            const url = SiteAllowance.parseUri(raw);
            const uri = `${url.hostname}${url.pathname}`;
            if (uri.endsWith('/')) return uri.substr(0, uri.length - 1)
            return uri;
        } catch (e) {
            return '';
        }
    }

    setValue(value: string[] | undefined): boolean {
        if (!value) return false;
        value = Object.keys(value
            .map(e => this.parseUri(e))
            .filter(e => e)
            .reduce((a, b) => {
                a[b] = true;
                return a
            }, {} as Record<string, boolean>))

        return super.setValue(value);
    }
}

export class blacklistedUrlsSetting extends UrlSettingsBase {
    constructor(provider: DependencyProvider) {
        super(provider, 'blacklistingurls')
    }
}

export class usingWhitelistingSetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'usingWhitelist', false, isBool)
    }
}

export class whitelistedUrlsSetting extends UrlSettingsBase {
    constructor(provider: DependencyProvider) {
        super(provider, 'whitelistingurls')
    }
}

export class dollarLocalizationSetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyLocalizationDollar', 'USD', e => hasLength(e, 3))
    }
}

export class yenLocalizationSetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyLocalizationAsian', 'JPY', e => hasLength(e, 3))
    }
}

export class kroneLocalizationSetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyLocalizationKroner', 'SEK', e => hasLength(e, 3))
    }
}

export class usingLocalizationAlertSetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'showNonDefaultCurrencyAlert', true, isBool)
    }
}

export class convertToSetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currency', 'USD', e => hasLength(e, 3))
    }
}

export class showConversionInBracketsSetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'uacc:currency:brackets', false, isBool)
    }
}

export class convertHoverShortcutSetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyShortcut', 'Shift', isString);
    }
}

export class convertAllShortcutSetting extends SyncSetting<string> {
    constructor(provider: DependencyProvider) {
        super(provider, 'shortcut:convert:all', '', isString)
    }
}

export class usingLeftClickFlipConversionSetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'utilityClickConvert', true, isBool)
    }
}

export class usingAutoConversionOnPageLoadSetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'currencyUsingAutomatic', true, isBool)
    }
}

export class usingHoverFlipConversionSetting extends SyncSetting<boolean> {
    constructor(provider: DependencyProvider) {
        super(provider, 'utilityHoverConvert', false, isBool)
    }
}