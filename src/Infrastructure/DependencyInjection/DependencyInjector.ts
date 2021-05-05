import {Browser, IBrowser} from '../Browser';
import {BackendApi, IBackendApi} from '../../CurrencyConverter/BackendApi';
import {ILogger, Logger} from '../Logger';
import {
    Configuration,
    ConfigurationAlert,
    ConfigurationBlacklist,
    ConfigurationCurrency,
    ConfigurationCustomTag,
    ConfigurationDisabledCurrencies,
    ConfigurationDisplay,
    ConfigurationFirstTime,
    ConfigurationHighLight,
    ConfigurationLocalisation,
    ConfigurationShortcuts,
    ConfigurationUtility,
    ConfigurationWhitelist
} from '../Configuration';
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
import {ThemeConfiguration} from '../Configuration/Configuration';

export class DependencyProvider extends Provider {
    get provider(): DependencyProvider { return this }

    get browser(): IBrowser { return this.getRequired(Browser) }

    get logger(): ILogger { return this.getRequired(Logger) }

    get backendApi(): IBackendApi { return this.getRequired(BackendApi) }

    get siteAllowance(): ISiteAllowance { return this.getRequired(SiteAllowance) }

    get themeConfiguration(): ThemeConfiguration { return this.getRequired(ThemeConfiguration) }

    get configurationFirstTime(): ConfigurationFirstTime { return this.getRequired(ConfigurationFirstTime) }

    get configurationDisabledCurrencies(): ConfigurationDisabledCurrencies { return this.getRequired(ConfigurationDisabledCurrencies) }

    get configurationShortcut(): ConfigurationShortcuts { return this.getRequired(ConfigurationShortcuts) }

    get configurationAlert(): ConfigurationAlert { return this.getRequired(ConfigurationAlert) }

    get configurationLocalization(): ConfigurationLocalisation { return this.getRequired(ConfigurationLocalisation) }

    get configurationWhitelist(): ConfigurationWhitelist { return this.getRequired(ConfigurationWhitelist) }

    get configurationBlacklist(): ConfigurationBlacklist { return this.getRequired(ConfigurationBlacklist) }

    get configurationCurrency(): ConfigurationCurrency { return this.getRequired(ConfigurationCurrency) }

    get configurationUtility(): ConfigurationUtility { return this.getRequired(ConfigurationUtility) }

    get configurationHighlight(): ConfigurationHighLight { return this.getRequired(ConfigurationHighLight) }

    get configurationTag(): ConfigurationCustomTag { return this.getRequired(ConfigurationCustomTag) }

    get configurationDisplay(): ConfigurationDisplay { return this.getRequired(ConfigurationDisplay) }

    get configuration(): Configuration { return this.getRequired(Configuration) }

    get textDetector(): ITextDetector { return this.getRequired(TextDetector) }

    get elementDetector(): IElementDetector { return this.getRequired(ElementDetector) }

    get activeLocalization(): IActiveLocalization { return this.getRequired(ActiveLocalization) }
}

export function useProvider(): DependencyProvider {
    return Container.build<DependencyProvider>() || addDependencies(Container.create(DependencyProvider)).build()
}

export function addDependencies(container: Container<DependencyProvider>) {
    return container
        .addSingleton(Browser)

        .addSingleton(Logger)
        .addSingleton(BackendApi)
        .addSingleton(SiteAllowance)

        .addSingleton(ConfigurationFirstTime)
        .addSingleton(ThemeConfiguration)
        .addSingleton(ConfigurationDisabledCurrencies)
        .addSingleton(ConfigurationShortcuts)
        .addSingleton(ConfigurationAlert)
        .addSingleton(ConfigurationLocalisation)
        .addSingleton(ConfigurationWhitelist)
        .addSingleton(ConfigurationBlacklist)
        .addSingleton(ConfigurationCurrency)
        .addSingleton(ConfigurationUtility)
        .addSingleton(ConfigurationHighLight)
        .addSingleton(ConfigurationCustomTag)
        .addSingleton(ConfigurationDisplay)
        .addSingleton(Configuration)

        .addSingleton(TextDetector)
        .addSingleton(ElementDetector)
        .addSingleton(ActiveLocalization)
}