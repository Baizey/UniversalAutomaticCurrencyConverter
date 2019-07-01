let _EngineInstance;

class Engine {

    /**
     * @returns {Engine}
     */
    static instance() {
        return _EngineInstance ? _EngineInstance : (_EngineInstance = new Engine());
    }

    constructor(browser = undefined, detector = undefined) {
        this.browser = browser ? browser : Browser.instance();
        this.currencyDetector = detector ? detector : CurrencyDetector.instance();
        this.blacklist = new Blacklist();
        this.whitelist = new Blacklist();
        this.customTag = new CustomTag();
        this.highlighter = new Highlighter();
        this.currencyConverter = new CurrencyConverter().withCustomTag(this.customTag);
        this.numberFormatter = new NumberFormatter();

        this.lastCurrencyUpdate = 'never';
        this.automaticPageConversion = true;
        this.conversionShortcut = 'Shift';
        this.isEnabled = true;
    }

    withCurrencyShortcut(value) {
        if (Utils.isDefined(value))
            this.conversionShortcut = value;
        return this.conversionShortcut;
    }

    using(isEnabled) {
        if (Utils.isDefined(isEnabled))
            this.isEnabled = isEnabled;
        return this.isEnabled;
    }

    shouldAutoconvert(value) {
        if (Utils.isDefined(value))
            this.automaticPageConversion = value;
        return this.automaticPageConversion;
    }

    getById(id) {
        switch (id) {
            case 'currencyLocalizationDollar':
                return this.currencyDetector.storedDefaultLocalization.dollar;
            case 'currencyLocalizationAsian':
                return this.currencyDetector.storedDefaultLocalization.asian;
            case 'currencyLocalizationKroner':
                return this.currencyDetector.storedDefaultLocalization.krone;

            case 'usingWhitelist':
                return this.whitelist.isEnabled;
            case 'whitelistingurls':
                return this.whitelist.urls;

            case 'usingBlacklist':
                return this.blacklist.isEnabled;
            case 'blacklistingurls':
                return this.blacklist.urls;

            case 'currency':
                return this.currencyConverter.baseCurrency;

            case 'usingCurrencyConverter':
                return this.isEnabled;
            case 'currencyUsingAutomatic':
                return this.automaticPageConversion;
            case 'currencyShortcut':
                return this.conversionShortcut;

            case 'currencyHighlightColor':
                return this.highlighter.color;
            case 'currencyHighlightDuration':
                return this.highlighter.duration;
            case 'currencyUsingHighlight':
                return this.highlighter.isEnabled;

            case 'currencyCustomTag':
                return this.customTag.tag;
            case 'currencyCustomTagValue':
                return this.customTag.value;
            case 'currencyUsingCustomTag':
                return this.customTag.enabled;

            case 'decimalAmount':
                return this.numberFormatter.rounding;
            case 'thousandDisplay':
                return this.numberFormatter.thousand;
            case 'decimalDisplay':
                return this.numberFormatter.decimal;
        }
        Utils.logError(`Unknown id to get value for ${id}`);
    }

    loadSettings() {
        const self = this;
        return new Promise(async resolve => {
            const resp = await Browser.load(Utils.storageIds());

            self.currencyDetector.withDefaultLocalization(resp['currencyLocalizationDollar']);
            self.currencyDetector.withDefaultLocalization(resp['currencyLocalizationKroner']);
            self.currencyDetector.withDefaultLocalization(resp['currencyLocalizationAsian']);

            self.currencyConverter.withBaseCurrency(resp['currency']);

            const usingBlacklistRaw = resp['usingBlacklist'];
            const usingBlacklist = usingBlacklistRaw === true || usingBlacklistRaw === 'blacklist';
            const usingWhitelist = usingBlacklistRaw === 'whitelist';

            self.blacklist.using(usingBlacklist);
            self.blacklist.withUrls(resp['blacklistingurls']);

            self.whitelist.using(usingWhitelist);
            self.whitelist.withUrls(resp['whitelistingurls']);

            self.using(resp['usingCurrencyConverter']);
            self.shouldAutoconvert(resp['currencyUsingAutomatic']);
            self.withCurrencyShortcut(resp['currencyShortcut']);

            self.highlighter.withColor(resp['currencyHighlightColor']);
            self.highlighter.withDuration(resp['currencyHighlightDuration']);
            self.highlighter.using(resp['currencyUsingHighlight']);

            self.customTag.withTag(resp['currencyCustomTag']);
            self.customTag.withValue(resp['currencyCustomTagValue']);
            self.customTag.using(resp['currencyUsingCustomTag']);

            self.numberFormatter.withRounding(resp['decimalAmount']);
            self.numberFormatter.withThousand(resp['thousandDisplay']);
            self.numberFormatter.withDecimal(resp['decimalDisplay']);

            await self.getConversionRates().catch(async () => {
                await self.getConversionRates();
            });
            resolve(self);
        });
    }

    /**
     * @param {number|SearchResult} value
     * @param {string} from
     * @return {string}
     */
    transform(value, from = undefined) {
        let searchResult;
        if (!from) {
            searchResult = value;
            value = searchResult.number;
            from = searchResult.currency;
        }

        const converted = this.currencyConverter.convert(value, from);
        const rounded = this.numberFormatter.round(converted);
        const formatted = this.numberFormatter.format(rounded);
        const customized = this.customTag.converter(formatted, this.currencyConverter.baseCurrency);

        if (searchResult) return searchResult.result(() => customized);
        return customized;
    }

    getCurrencySymbols() {
        return Browser.httpGet('symbols').catch(e => e.info);
    }

    getConversionRates() {
        const self = this;
        const base = this.currencyConverter.baseCurrency;
        const storageName = 'currencyConversionRates';
        return new Promise(async (resolve, reject) => {
            let stored = await Browser.load(storageName).then(resp => resp[storageName]);
            // Check if we can use what we already know
            if (stored && stored.actualBase === base) {
                const curr = new Date().getTime();
                const last = new Date(stored.date).getTime();
                if (curr <= last + (1000 * 60 * 60 * 24 * 2)) {
                    self.currencyConverter.withConversionRatesBase(stored.base);
                    self.currencyConverter.withConversionRates(stored.rates);
                    self.lastCurrencyUpdate = stored.date;
                    Object.keys(stored.rates).forEach(tag => self.currencyDetector.currencies[tag] = tag);
                    return resolve(stored);
                }
            }

            const conversion = await Browser.httpGet('rates');

            if (!conversion || conversion.error)
                return reject(conversion);

            conversion.actualBase = base;
            if (!conversion.rates[conversion.base])
                conversion.rates[conversion.base] = 1;

            await Browser.save(storageName, JSON.stringify(conversion));
            self.lastCurrencyUpdate = conversion.date;
            self.currencyConverter.withConversionRatesBase(conversion.base);
            self.currencyConverter.withConversionRates(conversion.rates);
            Object.keys(conversion.rates).forEach(tag => self.currencyDetector.currencies[tag] = tag);
            resolve(conversion);
        });
    }

}