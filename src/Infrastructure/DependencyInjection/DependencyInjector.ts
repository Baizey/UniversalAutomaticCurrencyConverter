import {Browser, IBrowser} from '../Browser';
import {BackendApi, IBackendApi} from '../../CurrencyConverter/BackendApi';
import {ILogger, Logger} from '../Logger';
import {Configuration} from '../Configuration';
import {
    ElementDetector,
    IElementDetector,
    ISiteAllowance,
    ITextDetector,
    SiteAllowance,
    TextDetector,
} from '../../CurrencyConverter/Detection';
import {ActiveLocalization, IActiveLocalization} from '../../CurrencyConverter/Localization';
import {Container, Provider} from './';
import {
    blacklistedUrlsSetting,
    colorThemeSetting,
    conversionDisplaySetting,
    convertAllShortcutSetting,
    convertHoverShortcutSetting,
    convertToSetting,
    customConversionRateSetting,
    decimalPointSetting,
    disabledCurrenciesSetting,
    dollarLocalizationSetting,
    highlightColorSetting,
    highlightDurationSetting,
    isFirstTimeSetting,
    kroneLocalizationSetting,
    showConversionInBracketsSetting,
    significantDigitsSetting,
    thousandsSeparatorSetting,
    usingAutoConversionOnPageLoadSetting,
    usingBlacklistingSetting,
    usingConversionHighlightingSetting,
    usingCustomDisplaySetting,
    usingHoverFlipConversionSetting,
    usingLeftClickFlipConversionSetting,
    usingLocalizationAlertSetting,
    usingWhitelistingSetting,
    whitelistedUrlsSetting,
    yenLocalizationSetting
} from '../Configuration';
import {ISetting} from '../Configuration/ISetting';
import {miniConverterSetting} from '../Configuration/Configuration';

export class SettingProvider extends Provider {

    get miniConverterRows(): miniConverterSetting { return this.getRequired(miniConverterSetting) }

    get isFirstTime(): isFirstTimeSetting { return this.getRequired(isFirstTimeSetting) }

    get colorTheme(): colorThemeSetting { return this.getRequired(colorThemeSetting) }

    get disabledCurrencies(): disabledCurrenciesSetting { return this.getRequired(disabledCurrenciesSetting) }

    get significantDigits(): significantDigitsSetting { return this.getRequired(significantDigitsSetting) }

    get thousandsSeparator(): thousandsSeparatorSetting { return this.getRequired(thousandsSeparatorSetting) }

    get decimalPoint(): decimalPointSetting { return this.getRequired(decimalPointSetting) }

    get customDisplay(): conversionDisplaySetting { return this.getRequired(conversionDisplaySetting) }

    get customConversionRateDisplay(): customConversionRateSetting { return this.getRequired(customConversionRateSetting) }

    get usingCustomDisplay(): usingCustomDisplaySetting { return this.getRequired(usingCustomDisplaySetting) }

    get highlightColor(): highlightColorSetting { return this.getRequired(highlightColorSetting) }

    get highlightDuration(): highlightDurationSetting { return this.getRequired(highlightDurationSetting) }

    get usingConversionHighlighting(): usingConversionHighlightingSetting { return this.getRequired(usingConversionHighlightingSetting) }

    get usingBlacklisting(): usingBlacklistingSetting { return this.getRequired(usingBlacklistingSetting) }

    get blacklistedUrls(): blacklistedUrlsSetting { return this.getRequired(blacklistedUrlsSetting) }

    get usingWhitelisting(): usingWhitelistingSetting { return this.getRequired(usingWhitelistingSetting) }

    get whitelistedUrls(): whitelistedUrlsSetting { return this.getRequired(whitelistedUrlsSetting) }

    get dollarLocalization(): dollarLocalizationSetting { return this.getRequired(dollarLocalizationSetting) }

    get yenLocalization(): yenLocalizationSetting { return this.getRequired(yenLocalizationSetting) }

    get kroneLocalization(): kroneLocalizationSetting { return this.getRequired(kroneLocalizationSetting) }

    get usingLocalizationAlert(): usingLocalizationAlertSetting { return this.getRequired(usingLocalizationAlertSetting) }

    get convertTo(): convertToSetting { return this.getRequired(convertToSetting) }

    get showConversionInBrackets(): showConversionInBracketsSetting { return this.getRequired(showConversionInBracketsSetting) }

    get convertHoverShortcut(): convertHoverShortcutSetting { return this.getRequired(convertHoverShortcutSetting) }

    get convertAllShortcut(): convertAllShortcutSetting { return this.getRequired(convertAllShortcutSetting) }

    get usingLeftClickFlipConversion(): usingLeftClickFlipConversionSetting { return this.getRequired(usingLeftClickFlipConversionSetting) }

    get usingAutoConversionOnPageLoad(): usingAutoConversionOnPageLoadSetting { return this.getRequired(usingAutoConversionOnPageLoadSetting) }

    get usingHoverFlipConversion(): usingHoverFlipConversionSetting { return this.getRequired(usingHoverFlipConversionSetting) }

    get allSettings(): ISetting<any>[] {
        return [
            this.isFirstTime,
            this.colorTheme,
            this.disabledCurrencies,
            this.significantDigits,
            this.thousandsSeparator,
            this.decimalPoint,
            this.customDisplay,
            this.customConversionRateDisplay,
            this.usingCustomDisplay,
            this.highlightColor,
            this.highlightDuration,
            this.usingConversionHighlighting,
            this.usingBlacklisting,
            this.blacklistedUrls,
            this.usingWhitelisting,
            this.whitelistedUrls,
            this.dollarLocalization,
            this.yenLocalization,
            this.kroneLocalization,
            this.usingLocalizationAlert,
            this.convertTo,
            this.showConversionInBrackets,
            this.convertHoverShortcut,
            this.convertAllShortcut,
            this.usingLeftClickFlipConversion,
            this.usingAutoConversionOnPageLoad,
            this.usingHoverFlipConversion,
        ]
    }
}

export class DependencyProvider extends SettingProvider {

    get provider(): DependencyProvider { return this }

    get browser(): IBrowser { return this.getRequired(Browser) }

    get logger(): ILogger { return this.getRequired(Logger) }

    get backendApi(): IBackendApi { return this.getRequired(BackendApi) }

    get siteAllowance(): ISiteAllowance { return this.getRequired(SiteAllowance) }

    get configuration(): Configuration { return this.getRequired(Configuration) }

    get textDetector(): ITextDetector { return this.getRequired(TextDetector) }

    get elementDetector(): IElementDetector { return this.getRequired(ElementDetector) }

    get activeLocalization(): IActiveLocalization { return this.getRequired(ActiveLocalization) }
}

export function useProvider(): DependencyProvider {
    return Container.build<DependencyProvider>() || addDependencies(Container.create(DependencyProvider)).build()
}

export function useSettings(): SettingProvider {
    return useProvider();
}

function addSettingDependencies(container: Container<DependencyProvider>): Container<DependencyProvider> {
    return container
        .addSingleton(miniConverterSetting)
        .addSingleton(isFirstTimeSetting)
        .addSingleton(colorThemeSetting)
        .addSingleton(disabledCurrenciesSetting)
        .addSingleton(significantDigitsSetting)
        .addSingleton(thousandsSeparatorSetting)
        .addSingleton(decimalPointSetting)
        .addSingleton(conversionDisplaySetting)
        .addSingleton(customConversionRateSetting)
        .addSingleton(usingCustomDisplaySetting)
        .addSingleton(highlightColorSetting)
        .addSingleton(highlightDurationSetting)
        .addSingleton(usingConversionHighlightingSetting)
        .addSingleton(usingBlacklistingSetting)
        .addSingleton(blacklistedUrlsSetting)

        .addSingleton(usingWhitelistingSetting)
        .addSingleton(whitelistedUrlsSetting)
        .addSingleton(dollarLocalizationSetting)
        .addSingleton(yenLocalizationSetting)
        .addSingleton(kroneLocalizationSetting)
        .addSingleton(usingLocalizationAlertSetting)
        .addSingleton(convertToSetting)
        .addSingleton(showConversionInBracketsSetting)
        .addSingleton(convertHoverShortcutSetting)
        .addSingleton(convertAllShortcutSetting)
        .addSingleton(usingLeftClickFlipConversionSetting)
        .addSingleton(usingAutoConversionOnPageLoadSetting)
        .addSingleton(usingHoverFlipConversionSetting)
}

export function addDependencies(container: Container<DependencyProvider>) {
    return addSettingDependencies(container)
        .addSingleton(Browser)

        .addSingleton(Logger)
        .addSingleton(BackendApi)
        .addSingleton(SiteAllowance)

        .addSingleton(Configuration)

        .addSingleton(TextDetector)
        .addSingleton(ElementDetector)
        .addSingleton(ActiveLocalization)
}