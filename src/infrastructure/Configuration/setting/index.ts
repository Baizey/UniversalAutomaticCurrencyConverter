import {themes} from '../../Theme'
import {LocalSetting} from './LocalSetting'
import {SettingDep, SyncSetting} from './SyncSetting'
import {UrlSettingsBase} from './UrlSettingsBase'
import {
    hasLength,
    hasLengthRange,
    hasRegexMatch,
    isArray,
    isArrayWithRegexMatch,
    isBool,
    isDistinctArray,
    isNumber,
    isOfEnum,
    isPositiveInt,
    isString,
} from './validators'

export class HighlightDurationSetting extends SyncSetting<number> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyHighlightDuration', 500, isPositiveInt)
    }
}

export class HighlightColorSetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyHighlightColor', 'yellow', (e) => {
            try {
                const div = provider.browser.document.createElement('div')
                div.style.backgroundColor = e + ''
                return !!div.style.backgroundColor
            } catch (e) {
                return true
            }
        })
    }
}

export class DollarLocalizationSetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyLocalizationDollar', 'USD', (e) =>
            hasLength(e, 3),
        )
    }
}

export class DisabledCurrenciesSetting extends SyncSetting<string[]> {
    constructor(provider: SettingDep) {
        super(
            provider,
            'disabledCurrencies',
            [],
            (array) =>
                isArrayWithRegexMatch(array, /^[A-Z]{3}$/) && isDistinctArray(array),
        )
    }
}

export class DecimalPointSetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'decimalDisplay', '.', () => true)
    }
}

export class CustomConversionRateSetting extends SyncSetting<number> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyCustomTagValue', 1, isNumber)
    }
}

export class ConvertToSetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'currency', 'USD', (e) => hasLength(e, 3))
    }
}

export class ConvertHoverShortcutSetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyShortcut', 'Shift', isString)
    }
}

export class ConvertAllShortcutSetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'shortcut:convert:all', '', isString)
    }
}

export class ConversionDisplaySetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyCustomTag', '$¤', (e) =>
            hasRegexMatch(e, /.*¤.*/),
        )
    }
}

export class ColorThemeSetting extends SyncSetting<keyof typeof themes> {
    constructor(dep: SettingDep) {
        super(dep, 'uacc:theme:selection', 'lightTheme', isString)
    }
}

export class BlacklistedUrlsSetting extends UrlSettingsBase {
    constructor(provider: SettingDep) {
        super(provider, 'blacklistingurls')
    }
}

export class IsFirstTimeSetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'showFirstTimeGuide', true, isBool)
    }
}

export class IsPausedSetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'uacc:pause', false, isBool)
    }
}

export class KroneLocalizationSetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyLocalizationKroner', 'SEK', (e) =>
            hasLength(e, 3),
        )
    }
}

export class LastVersionSetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'lastVersion', '0.0.0', (e) =>
            hasRegexMatch(e, /^\d+\.\d+\.\d+$/),
        )
    }
}

type MiniConverterRow = {
    from: string;
    to: string;
    amount: number;
};

export class MiniConverterSetting extends LocalSetting<MiniConverterRow[]> {
    constructor(provider: SettingDep) {
        super(provider, 'uacc:global:converter', [], isArray)
    }
}

export class ShowConversionInBracketsSetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'uacc:currency:brackets', false, isBool)
    }
}

export class SignificantDigitsSetting extends SyncSetting<number> {
    constructor(provider: SettingDep) {
        super(provider, 'decimalAmount', 2, isPositiveInt)
    }
}

export class ThousandsSeparatorSetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'thousandDisplay', ' ', (e) => hasLengthRange(e, 0, 1))
    }
}

export enum LoggingSettingType {
    nothing = 'nothing',
    error = 'error',
    info = 'info',
    debug = 'debug',
    profile = 'profile'
}

export class UseDebugLoggingSetting extends SyncSetting<LoggingSettingType> {
    constructor(provider: SettingDep) {
        super(provider, 'uacc:debug:logging', LoggingSettingType.profile, (e) => isOfEnum(e, LoggingSettingType))
    }
}

export class UsingAutoConversionOnPageLoadSetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyUsingAutomatic', true, isBool)
    }
}

export class UsingConversionHighlightingSetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyUsingHighlight', true, isBool)
    }
}

export class UsingCustomDisplaySetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyUsingCustomTag', false, isBool)
    }
}

export class UsingHoverFlipConversionSetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'utilityHoverConvert', false, isBool)
    }
}

export class UsingLeftClickFlipConversionSetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'utilityClickConvert', true, isBool)
    }
}

export class UsingLocalizationAlertSetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'showNonDefaultCurrencyAlert', true, isBool)
    }
}

export class UsingWhitelistingSetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'usingWhitelist', false, isBool)
    }
}

export class UsingBlacklistingSetting extends SyncSetting<boolean> {
    constructor(provider: SettingDep) {
        super(provider, 'usingBlacklist', false, isBool)
    }
}

export class WhitelistedUrlsSetting extends UrlSettingsBase {
    constructor(provider: SettingDep) {
        super(provider, 'whitelistingurls')
    }
}

export class YenLocalizationSetting extends SyncSetting<string> {
    constructor(provider: SettingDep) {
        super(provider, 'currencyLocalizationAsian', 'JPY', (e) => hasLength(e, 3))
    }
}