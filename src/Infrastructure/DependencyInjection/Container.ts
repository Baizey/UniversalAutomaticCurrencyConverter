import {Configuration} from "../Configuration";
import {Browser, IBrowser} from "../Browser";
import {BackendApi, IBackendApi} from "../../CurrencyConverter/BackendApi";
import {ActiveLocalization, IActiveLocalization} from "../../CurrencyConverter/Localization";
import {Singleton} from "./Singleton";
import {Startup} from "../../CurrencyConverter/Startup";
import {IScopedService} from "./IScopedService";
import {ILogger, Logger} from "../Logger";
import {TextDetector, ITextDetector} from "../../CurrencyConverter/Detection";
import {ElementDetector, IElementDetector} from "../../CurrencyConverter/Detection/ElementDetector";
import {
    ConfigurationAlert,
    ConfigurationBlacklist,
    ConfigurationCurrency,
    ConfigurationCustomTag,
    ConfigurationDisplay,
    ConfigurationHighLight,
    ConfigurationLocalisation,
    ConfigurationShortcuts,
    ConfigurationUtility,
    ConfigurationWhitelist,
    DisabledCurrencies,
    FirstTimeConfiguration
} from "../Configuration";
import {BrowserMock} from "../../../tests/Browser.mock";
import {BackendApiMock} from "../../../tests/BackendApi.mock";


export class BuiltContainer {
    private container: Container;

    constructor(container: Container) {
        this.container = container;
    }

    get browser() { return this.container.browser.instance }

    get logger() { return this.container.logger.instance }

    get backendApi() { return this.container.backendApi.instance }

    get configurationFirstTime() { return this.container.configurationFirstTime.instance }

    get configurationDisabledCurrencies() { return this.container.configurationDisabledCurrencies.instance }

    get configurationShortcut() { return this.container.configurationShortcut.instance }

    get configurationAlert() { return this.container.configurationAlert.instance }

    get configurationLocalization() { return this.container.configurationLocalization.instance }

    get configurationWhitelist() { return this.container.configurationWhitelist.instance }

    get configurationBlacklist() { return this.container.configurationBlacklist.instance }

    get configurationCurrency() { return this.container.configurationCurrency.instance }

    get configurationUtility() { return this.container.configurationUtility.instance }

    get configurationHighlight() { return this.container.configurationHighlight.instance }

    get configurationTag() { return this.container.configurationTag.instance }

    get configurationDisplay() { return this.container.configurationDisplay.instance }

    get configuration() { return this.container.configuration.instance }

    get textDetector() { return this.container.textDetector.instance }

    get elementDetector() { return this.container.elementDetector.instance }

    get activeLocalization() { return this.container.activeLocalization.instance }

    get startup() { return this.container.startup.instance }
}


export class Container {
    private static instance: Container;

    configurationFirstTime: IScopedService<FirstTimeConfiguration>
    configurationDisabledCurrencies: IScopedService<DisabledCurrencies>
    configurationShortcut: IScopedService<ConfigurationShortcuts>
    configurationAlert: IScopedService<ConfigurationAlert>
    configurationLocalization: IScopedService<ConfigurationLocalisation>
    configurationWhitelist: IScopedService<ConfigurationWhitelist>
    configurationBlacklist: IScopedService<ConfigurationBlacklist>
    configurationCurrency: IScopedService<ConfigurationCurrency>
    configurationUtility: IScopedService<ConfigurationUtility>
    configurationHighlight: IScopedService<ConfigurationHighLight>
    configurationTag: IScopedService<ConfigurationCustomTag>
    configurationDisplay: IScopedService<ConfigurationDisplay>
    configuration: IScopedService<Configuration>

    browser: IScopedService<IBrowser>
    logger: IScopedService<ILogger>
    backendApi: IScopedService<IBackendApi>

    activeLocalization: IScopedService<IActiveLocalization>
    textDetector: IScopedService<ITextDetector>;

    elementDetector: IScopedService<IElementDetector>;
    startup: IScopedService<Startup>;

    constructor() {
        const build = this.build()
        const singleton = function <T>(provider: (build: BuiltContainer) => T): IScopedService<T> {
            return new Singleton(build, provider);
        }

        this.browser = singleton(() => new Browser())
        this.logger = singleton(container => new Logger(container))
        this.backendApi = singleton(container => new BackendApi(container))

        this.configurationFirstTime = singleton(container => new FirstTimeConfiguration(container))
        this.configurationDisabledCurrencies = singleton(container => new DisabledCurrencies(container))
        this.configurationShortcut = singleton(container => new ConfigurationShortcuts(container))
        this.configurationAlert = singleton(container => new ConfigurationAlert(container))
        this.configurationLocalization = singleton(container => new ConfigurationLocalisation(container))
        this.configurationWhitelist = singleton(container => new ConfigurationWhitelist(container))
        this.configurationBlacklist = singleton(container => new ConfigurationBlacklist(container))
        this.configurationCurrency = singleton(container => new ConfigurationCurrency(container))
        this.configurationUtility = singleton(container => new ConfigurationUtility(container))
        this.configurationHighlight = singleton(container => new ConfigurationHighLight(container))
        this.configurationTag = singleton(container => new ConfigurationCustomTag(container))
        this.configurationDisplay = singleton(container => new ConfigurationDisplay(container))
        this.configuration = singleton(container => new Configuration(container))

        this.textDetector = singleton(container => new TextDetector(container))

        this.elementDetector = singleton(container => new ElementDetector(container))
        this.activeLocalization = singleton(container => new ActiveLocalization(container))
        this.startup = singleton(container => new Startup(container))
    }

    build(): BuiltContainer {
        return new BuiltContainer(this);
    }

    public static mock() {
        const container = new Container();
        container.browser.override(() => new BrowserMock())
        container.backendApi.override(() => new BackendApiMock())
        return container;
    }

    public static setup(container?: Container): Container {
        if (container) Container.instance = container;
        if (!this.instance) Container.instance = new Container();
        return Container.instance;
    }

    public static factory(): BuiltContainer {
        return Container.setup().build()
    }
}