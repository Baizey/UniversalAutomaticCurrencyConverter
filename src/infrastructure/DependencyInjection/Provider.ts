import { Browser, IBrowser } from "../Browser";
import { BackendApi, IBackendApi } from "../../currencyConverter/BackendApi";
import { ILogger, Logger } from "../Logger";
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
} from "../Configuration";
import {
  ElementDetector,
  IElementDetector,
  ISiteAllowance,
  ITextDetector,
  SiteAllowance,
  TextDetector
} from "../../currencyConverter/Detection";
import { ActiveLocalization, IActiveLocalization } from "../../currencyConverter/Localization";
import {
  IsPausedSetting,
  LastVersionSetting,
  miniConverterSetting,
  useDebugLoggingSetting
} from "../Configuration/Configuration";
import { ISetting } from "../Configuration/ISetting";
import { TabState } from "../../currencyConverter/Live/TabState";
import { IServiceCollection, ServiceCollection, ServiceProvider } from "sharp-dependency-injection/lib";

export class WeakProvider {
  tabState?: TabState;
  browser?: IBrowser;
  logger?: ILogger;
  backendApi?: IBackendApi;
  configuration?: Configuration;
  siteAllowance?: ISiteAllowance;
  textDetector?: ITextDetector;
  elementDetector?: IElementDetector;
  activeLocalization?: IActiveLocalization;
  lastVersion?: LastVersionSetting;
  useLogging?: useDebugLoggingSetting;
  miniConverter?: miniConverterSetting;
  isFirstTime?: isFirstTimeSetting;
  colorTheme?: colorThemeSetting;
  disabledCurrencies?: disabledCurrenciesSetting;
  significantDigits?: significantDigitsSetting;
  thousandsSeparator?: thousandsSeparatorSetting;
  decimalPoint?: decimalPointSetting;
  customDisplay?: conversionDisplaySetting;
  customConversionRateDisplay?: customConversionRateSetting;
  usingCustomDisplay?: usingCustomDisplaySetting;
  highlightColor?: highlightColorSetting;
  highlightDuration?: highlightDurationSetting;
  usingConversionHighlighting?: usingConversionHighlightingSetting;
  usingBlacklisting?: usingBlacklistingSetting;
  blacklistedUrls?: blacklistedUrlsSetting;
  usingWhitelisting?: usingWhitelistingSetting;
  whitelistedUrls?: whitelistedUrlsSetting;
  dollarLocalization?: dollarLocalizationSetting;
  yenLocalization?: yenLocalizationSetting;
  kroneLocalization?: kroneLocalizationSetting;
  usingLocalizationAlert?: usingLocalizationAlertSetting;
  convertTo?: convertToSetting;
  showConversionInBrackets?: showConversionInBracketsSetting;
  convertHoverShortcut?: convertHoverShortcutSetting;
  convertAllShortcut?: convertAllShortcutSetting;
  usingLeftClickFlipConversion?: usingLeftClickFlipConversionSetting;
  usingAutoConversionOnPageLoad?: usingAutoConversionOnPageLoadSetting;
  usingHoverFlipConversion?: usingHoverFlipConversionSetting;
  isPaused?: IsPausedSetting;
  allSettings?: ISetting<any>[];
}

export type Provider = Required<WeakProvider>;

function addSettingDependencies(services: IServiceCollection<Provider>): IServiceCollection<Provider> {
  services.addSingleton({ dependency: usingHoverFlipConversionSetting, selector: p => p.usingHoverFlipConversion });
  services.addSingleton({ dependency: LastVersionSetting, selector: p => p.lastVersion });
  services.addSingleton({ dependency: IsPausedSetting, selector: p => p.isPaused });
  services.addSingleton({ dependency: useDebugLoggingSetting, selector: p => p.useLogging });
  services.addSingleton({ dependency: miniConverterSetting, selector: p => p.miniConverter });
  services.addSingleton({ dependency: isFirstTimeSetting, selector: p => p.isFirstTime });
  services.addSingleton({ dependency: colorThemeSetting, selector: p => p.colorTheme });
  services.addSingleton({ dependency: disabledCurrenciesSetting, selector: p => p.disabledCurrencies });
  services.addSingleton({ dependency: significantDigitsSetting, selector: p => p.significantDigits });
  services.addSingleton({ dependency: thousandsSeparatorSetting, selector: p => p.thousandsSeparator });
  services.addSingleton({ dependency: decimalPointSetting, selector: p => p.decimalPoint });
  services.addSingleton({ dependency: conversionDisplaySetting, selector: p => p.customDisplay });
  services.addSingleton({ dependency: customConversionRateSetting, selector: p => p.customConversionRateDisplay });
  services.addSingleton({ dependency: usingCustomDisplaySetting, selector: p => p.usingCustomDisplay });
  services.addSingleton({ dependency: highlightColorSetting, selector: p => p.highlightColor });
  services.addSingleton({ dependency: highlightDurationSetting, selector: p => p.highlightDuration });
  services.addSingleton({
    dependency: usingConversionHighlightingSetting,
    selector: p => p.usingConversionHighlighting
  });
  services.addSingleton({ dependency: usingBlacklistingSetting, selector: p => p.usingBlacklisting });
  services.addSingleton({ dependency: blacklistedUrlsSetting, selector: p => p.blacklistedUrls });
  services.addSingleton({ dependency: usingWhitelistingSetting, selector: p => p.usingWhitelisting });
  services.addSingleton({ dependency: whitelistedUrlsSetting, selector: p => p.whitelistedUrls });
  services.addSingleton({ dependency: dollarLocalizationSetting, selector: p => p.dollarLocalization });
  services.addSingleton({ dependency: yenLocalizationSetting, selector: p => p.yenLocalization });
  services.addSingleton({ dependency: kroneLocalizationSetting, selector: p => p.kroneLocalization });
  services.addSingleton({ dependency: usingLocalizationAlertSetting, selector: p => p.usingLocalizationAlert });
  services.addSingleton({ dependency: convertToSetting, selector: p => p.convertTo });
  services.addSingleton({ dependency: showConversionInBracketsSetting, selector: p => p.showConversionInBrackets });
  services.addSingleton({ dependency: convertHoverShortcutSetting, selector: p => p.convertHoverShortcut });
  services.addSingleton({ dependency: convertAllShortcutSetting, selector: p => p.convertAllShortcut });
  services.addSingleton({
    dependency: usingLeftClickFlipConversionSetting,
    selector: p => p.usingLeftClickFlipConversion
  });
  services.addSingleton({
    dependency: usingAutoConversionOnPageLoadSetting,
    selector: p => p.usingAutoConversionOnPageLoad
  });
  services.addSingleton<ISetting<any>[]>({
    factory: ({
                isPaused,
                useLogging,
                isFirstTime,
                colorTheme,
                disabledCurrencies,
                significantDigits,
                thousandsSeparator,
                decimalPoint,
                customDisplay,
                customConversionRateDisplay,
                usingCustomDisplay,
                highlightColor,
                highlightDuration,
                usingConversionHighlighting,
                usingBlacklisting,
                blacklistedUrls,
                usingWhitelisting,
                whitelistedUrls,
                dollarLocalization,
                yenLocalization,
                kroneLocalization,
                usingLocalizationAlert,
                convertTo,
                showConversionInBrackets,
                convertHoverShortcut,
                convertAllShortcut,
                usingLeftClickFlipConversion,
                usingAutoConversionOnPageLoad,
                usingHoverFlipConversion
              }: Provider) => [
      isPaused,
      useLogging,
      isFirstTime,
      colorTheme,
      disabledCurrencies,
      significantDigits,
      thousandsSeparator,
      decimalPoint,
      customDisplay,
      customConversionRateDisplay,
      usingCustomDisplay,
      highlightColor,
      highlightDuration,
      usingConversionHighlighting,
      usingBlacklisting,
      blacklistedUrls,
      usingWhitelisting,
      whitelistedUrls,
      dollarLocalization,
      yenLocalization,
      kroneLocalization,
      usingLocalizationAlert,
      convertTo,
      showConversionInBrackets,
      convertHoverShortcut,
      convertAllShortcut,
      usingLeftClickFlipConversion,
      usingAutoConversionOnPageLoad,
      usingHoverFlipConversion
    ],
    selector: provider => provider.allSettings
  });
  return services;
}

function addDependencies(services: IServiceCollection<Provider>): IServiceCollection<Provider> {
  addSettingDependencies(services);
  services.addSingleton(TabState);
  services.addSingleton(Browser);
  services.addSingleton(Logger);
  services.addSingleton(BackendApi);
  services.addSingleton(SiteAllowance);
  services.addSingleton(Configuration);
  services.addSingleton(TextDetector);
  services.addSingleton(ElementDetector);
  services.addSingleton(ActiveLocalization);
  return services;
}

export class Container {
  private static provider: ServiceProvider<Provider>;

  public static getOrCreate(factory: () => IServiceCollection<Provider>) {
    if (this.provider) return this.provider;
    const services = factory();
    return (this.provider = services.build());
  }
}

const useProvider = (): ServiceProvider<Provider> => {
  return Container.getOrCreate(() => addDependencies(new ServiceCollection(WeakProvider))) as ServiceProvider<Provider>;
};

export { useProvider, addDependencies };