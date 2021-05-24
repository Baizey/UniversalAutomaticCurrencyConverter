import {Browser, IBrowser} from '../Browser';
import {BackendApi, IBackendApi} from '../../currencyConverter/BackendApi';
import {ILogger, Logger} from '../Logger';
import {
    blacklistedUrlsSetting,
    colorThemeSetting,
    Configuration,
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
import {
    ElementDetector,
    IElementDetector,
    ISiteAllowance,
    ITextDetector,
    SiteAllowance,
    TextDetector,
} from '../../currencyConverter/Detection';
import {ActiveLocalization, IActiveLocalization} from '../../currencyConverter/Localization';
import {Container, IProvider} from './';
import {IsPausedSetting, miniConverterSetting, useDebugLoggingSetting} from '../Configuration/Configuration';
import {IContainer} from './package';
import {ISetting} from '../Configuration/ISetting';
import {TabInformation} from '../../currencyConverter/Live/TabInformation';

interface DependencyProvider extends IProvider<DependencyProvider> {
    tabInformation: TabInformation
    browser: IBrowser
    logger: ILogger
    backendApi: IBackendApi
    configuration: Configuration
    siteAllowance: ISiteAllowance
    textDetector: ITextDetector
    elementDetector: IElementDetector
    activeLocalization: IActiveLocalization

    useLogging: useDebugLoggingSetting
    miniConverter: miniConverterSetting
    isFirstTime: isFirstTimeSetting
    colorTheme: colorThemeSetting
    disabledCurrencies: disabledCurrenciesSetting
    significantDigits: significantDigitsSetting
    thousandsSeparator: thousandsSeparatorSetting
    decimalPoint: decimalPointSetting
    customDisplay: conversionDisplaySetting
    customConversionRateDisplay: customConversionRateSetting
    usingCustomDisplay: usingCustomDisplaySetting
    highlightColor: highlightColorSetting
    highlightDuration: highlightDurationSetting
    usingConversionHighlighting: usingConversionHighlightingSetting
    usingBlacklisting: usingBlacklistingSetting
    blacklistedUrls: blacklistedUrlsSetting
    usingWhitelisting: usingWhitelistingSetting
    whitelistedUrls: whitelistedUrlsSetting
    dollarLocalization: dollarLocalizationSetting
    yenLocalization: yenLocalizationSetting
    kroneLocalization: kroneLocalizationSetting
    usingLocalizationAlert: usingLocalizationAlertSetting
    convertTo: convertToSetting
    showConversionInBrackets: showConversionInBracketsSetting
    convertHoverShortcut: convertHoverShortcutSetting
    convertAllShortcut: convertAllShortcutSetting
    usingLeftClickFlipConversion: usingLeftClickFlipConversionSetting
    usingAutoConversionOnPageLoad: usingAutoConversionOnPageLoadSetting
    usingHoverFlipConversion: usingHoverFlipConversionSetting
    isPaused: IsPausedSetting
    allSettings: ISetting<any>[]
}

function addSettingDependencies(container: IContainer<DependencyProvider>): IContainer<DependencyProvider> {
    return container
        .addSingleton(IsPausedSetting, {name: 'isPaused'})
        .addSingleton(useDebugLoggingSetting, {name: 'useLogging'})
        .addSingleton(miniConverterSetting, {name: 'miniConverter'})
        .addSingleton(isFirstTimeSetting, {name: 'isFirstTime'})
        .addSingleton(colorThemeSetting, {name: 'colorTheme'})
        .addSingleton(disabledCurrenciesSetting, {name: 'disabledCurrencies'})
        .addSingleton(significantDigitsSetting, {name: 'significantDigits'})
        .addSingleton(thousandsSeparatorSetting, {name: 'thousandsSeparator'})
        .addSingleton(decimalPointSetting, {name: 'decimalPoint'})
        .addSingleton(conversionDisplaySetting, {name: 'customDisplay'})
        .addSingleton(customConversionRateSetting, {name: 'customConversionRateDisplay'})
        .addSingleton(usingCustomDisplaySetting, {name: 'usingCustomDisplay'})
        .addSingleton(highlightColorSetting, {name: 'highlightColor'})
        .addSingleton(highlightDurationSetting, {name: 'highlightDuration'})
        .addSingleton(usingConversionHighlightingSetting, {name: 'usingConversionHighlighting'})
        .addSingleton(usingBlacklistingSetting, {name: 'usingBlacklisting'})
        .addSingleton(blacklistedUrlsSetting, {name: 'blacklistedUrls'})
        .addSingleton(usingWhitelistingSetting, {name: 'usingWhitelisting'})
        .addSingleton(whitelistedUrlsSetting, {name: 'whitelistedUrls'})
        .addSingleton(dollarLocalizationSetting, {name: 'dollarLocalization'})
        .addSingleton(yenLocalizationSetting, {name: 'yenLocalization'})
        .addSingleton(kroneLocalizationSetting, {name: 'kroneLocalization'})
        .addSingleton(usingLocalizationAlertSetting, {name: 'usingLocalizationAlert'})
        .addSingleton(convertToSetting, {name: 'convertTo'})
        .addSingleton(showConversionInBracketsSetting, {name: 'showConversionInBrackets'})
        .addSingleton(convertHoverShortcutSetting, {name: 'convertHoverShortcut'})
        .addSingleton(convertAllShortcutSetting, {name: 'convertAllShortcut'})
        .addSingleton(usingLeftClickFlipConversionSetting, {name: 'usingLeftClickFlipConversion'})
        .addSingleton(usingAutoConversionOnPageLoadSetting, {name: 'usingAutoConversionOnPageLoad'})
        .addSingleton(usingHoverFlipConversionSetting, {name: 'usingHoverFlipConversion'})
        .addSingleton<ISetting<any>[]>(p => [
            p.isPaused,
            p.useLogging,
            p.isFirstTime,
            p.colorTheme,
            p.disabledCurrencies,
            p.significantDigits,
            p.thousandsSeparator,
            p.decimalPoint,
            p.customDisplay,
            p.customConversionRateDisplay,
            p.usingCustomDisplay,
            p.highlightColor,
            p.highlightDuration,
            p.usingConversionHighlighting,
            p.usingBlacklisting,
            p.blacklistedUrls,
            p.usingWhitelisting,
            p.whitelistedUrls,
            p.dollarLocalization,
            p.yenLocalization,
            p.kroneLocalization,
            p.usingLocalizationAlert,
            p.convertTo,
            p.showConversionInBrackets,
            p.convertHoverShortcut,
            p.convertAllShortcut,
            p.usingLeftClickFlipConversion,
            p.usingAutoConversionOnPageLoad,
            p.usingHoverFlipConversion,
        ], {name: 'allSettings'})
}

function addDependencies(container: IContainer<DependencyProvider>): IContainer<DependencyProvider> {
    return addSettingDependencies(container)
        .addSingleton(TabInformation)
        .addSingleton(Browser)

        .addSingleton(Logger)
        .addSingleton(BackendApi)
        .addSingleton(SiteAllowance)

        .addSingleton(Configuration)

        .addSingleton(TextDetector)
        .addSingleton(ElementDetector)
        .addSingleton(ActiveLocalization)
}

const useProvider = () => Container.use(addDependencies)

export {useProvider, addDependencies, DependencyProvider}