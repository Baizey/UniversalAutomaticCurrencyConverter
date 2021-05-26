import {IBrowser, ILogger} from "../../infrastructure";
import {CurrencyLocalization} from "./CurrencyLocalization";
import {Localizations} from "./Localization";
import {IBackendApi} from "../BackendApi";
import {disabledCurrenciesSetting} from '../../infrastructure/Configuration';
import {DependencyProvider} from '../../infrastructure/DependencyInjection';

export interface IActiveLocalization {
    readonly krone: CurrencyLocalization;
    readonly yen: CurrencyLocalization;
    readonly dollar: CurrencyLocalization;

    readonly compact: [string, string, string]
    isLocked: boolean

    parseCurrency(raw: string): string | null

    load(): Promise<void>

    save(): Promise<void>

    reset(toDefault: boolean): Promise<void>

    overload(input?: Partial<Compact>): Promise<void>

    hasConflict(): boolean

    setLocked(bool: boolean): Promise<void>

    determineForSite(siteAsText: string): void
}

type Compact = { dollar: string, yen: string, krone: string }

export class ActiveLocalization implements IActiveLocalization {

    isLocked: boolean;
    private readonly browser: IBrowser;
    private readonly backendApi: IBackendApi;
    readonly krone: CurrencyLocalization;
    readonly yen: CurrencyLocalization;
    readonly dollar: CurrencyLocalization;
    private readonly lockedKey: string;
    private readonly localizationMapping: Record<string, string>;
    private readonly isDisabled: Record<string, boolean>;
    private symbols: Record<string, string>
    private logger: ILogger;
    private disabledCurrencies: disabledCurrenciesSetting;

    constructor({
                    provider,
                    kroneLocalization,
                    yenLocalization,
                    dollarLocalization,
                    disabledCurrencies,
                    logger,
                    browser,
                    backendApi
                }: DependencyProvider) {
        this.disabledCurrencies = disabledCurrencies;
        this.logger = logger;
        this.backendApi = backendApi;
        this.browser = browser;
        const kroneKey = `uacc:site:localization:krone:${this.browser.hostname}`;
        const yenKey = `uacc:site:localization:yen:${this.browser.hostname}`;
        const dollarKey = `uacc:site:localization:dollar:${this.browser.hostname}`;
        this.lockedKey = `uacc:site:localization:locked:${this.browser.hostname}`;

        this.isLocked = false;
        this.localizationMapping = Localizations.uniqueSymbols;
        this.symbols = {}
        this.isDisabled = {}

        this.krone = new CurrencyLocalization(provider, kroneKey, kroneLocalization);
        this.dollar = new CurrencyLocalization(provider, dollarKey, dollarLocalization);
        this.yen = new CurrencyLocalization(provider, yenKey, yenLocalization);
    }

    get compact(): [string, string, string] {
        return [this.krone.value, this.yen.value, this.dollar.value]
    }

    parseCurrency(raw: string): string | null {
        // Convert from display to currency tag
        const localized = this.localizationMapping[raw] || raw;

        if (!localized) return null;

        // Verify it exists in our known currency tags
        if (!this.symbols[localized]) return null;

        // Verify it is not disabled
        if (this.isDisabled[localized]) return null;

        return localized;
    }

    async load(): Promise<void> {
        this.isLocked = await this.browser.loadLocal<boolean>(this.lockedKey);
        await Promise.all([
            this.krone.load(),
            this.yen.load(),
            this.dollar.load()
        ]);
        await this.determineForSite()
        this.symbols = await this.backendApi.symbols();
        this.disabledCurrencies.value.forEach(v => this.isDisabled[v] = true);
        this.updateLocalization(this.compact)
    }

    async save(): Promise<void> {
        await Promise.all([
            this.krone.save(),
            this.yen.save(),
            this.dollar.save()
        ]);
    }

    async setLocked(bool: boolean): Promise<void> {
        await this.browser.saveLocal(this.lockedKey, bool);
    }

    async reset(toDefault: boolean): Promise<void> {
        this.krone.reset(toDefault);
        this.yen.reset(toDefault);
        this.dollar.reset(toDefault);
        await this.setLocked(false);
    }

    async overload(input?: Partial<Compact>): Promise<void> {
        this.krone.override(input?.krone);
        this.yen.override(input?.yen);
        this.dollar.override(input?.dollar);
        this.updateLocalization([this.krone.value, this.yen.value, this.dollar.value])
        await this.setLocked(false);
    }

    hasConflict(): boolean {
        if (this.krone.hasConflict() || this.yen.hasConflict() || this.dollar.hasConflict())
            return !this.isLocked;
        return false;
    }

    determineForSite(siteAsText?: string): void {
        siteAsText = siteAsText || document.body.innerText;
        // If the user has locked localization for site, do nothing
        if (this.isLocked) return;
        const shared = Localizations.shared;

        this.yen.setDetected(this._determine(this.yen.value, siteAsText, shared['¥']))
        this.logger.debug(`Detected ${this.yen.detectedValue}, default ${this.yen.defaultValue}`)

        this.dollar.setDetected(this._determine(this.dollar.value, siteAsText, shared['$']))
        this.logger.debug(`Detected ${this.dollar.detectedValue}, default ${this.dollar.defaultValue}`)

        this.krone.setDetected(this._determine(this.krone.value, siteAsText, shared['kr']))
        this.logger.debug(`Detected ${this.krone.detectedValue}, default ${this.krone.defaultValue}`)

        this.logger.debug(`Found localization conflict: ${this.hasConflict()}`);
    }

    private _determine(currentTag: string, text: string, tags: string[]): string {
        const hostMapping = Localizations.hostCurrency;
        const host = this.browser.host as keyof typeof hostMapping
        const hostCurrency: string | undefined = hostMapping[host];

        // Add 1 to counter if host is same as currency and add 1 if current default is same
        const counter = tags.map(t => ({tag: t, count: (hostCurrency === t ? 1 : 0) + (currentTag === t ? 1 : 0)}));
        counter.forEach(tag => {
            const re = new RegExp('(^|[\\W_])' + tag.tag + '($|[\\W_])', 'gm');
            tag.count += ((text || '').match(re) || []).length
        });
        return counter.reduce((p, n) => p.count > n.count ? p : n).tag
    }

    private updateLocalization(values: string[]) {
        Object.entries(Localizations.shared).forEach(([symbol, currencies]) =>
            this.localizationMapping[symbol] = currencies.filter(e => values.indexOf(e) >= 0)[0])
    }
}