let _detectorInstance;

class Detector {
    /**
     * @returns {Detector}
     */
    static get instance() {
        if (!_detectorInstance) _detectorInstance = new Detector();
        return _detectorInstance;
    }

    /**
     * @param {{config: Configuration, browser: Browser, currencies: Currencies, activeLocalization: ActiveLocalization}} services
     */
    constructor(services = {}) {
        this._config = services.config || Configuration.instance;
        this._browser = services.browser || Browser.instance;
        this._activeLocalization = services.activeLocalization || ActiveLocalization.instance;
        this._currencies = services.currencies || Currencies.instance;
        this._regex = null;
        this._currencyTags = null;
        this._localizationMapping = Localizations.allUniqueLocalizationMappings;
    }

    _currencyRegex() {
        // Simplification of Localizations' symbols
        return '(' + [
            /[¥A-Z]{3}\$?/.source,
            /,-{1,2}|kr\.?/.source,
            /CDN\$/.source,
            /R\$/.source,
            /US ?\$/.source,
            /dollars?/.source,
            'Kč',
            'zł',
            /[$£€₺Ł元₿Ξ฿₴ɱ₽¥₩]/.source,
        ].join('|') + ')?';
    }

    _amountRegex() {
        // Find normal numbers
        const normalInteger = /(?:(?:\d{1,3}?(?:[., ]\d{3})*)|\d{4,})/.source;
        const normalDecimal = /(?:\s*[.,]\s*(?:\d{1,2}|-{2}))/.source;

        // Find small decimal numbers
        const smallInteger = /(?:0)/.source;
        const smallDecimal = /(?:[,.]\d+)/.source;

        // Find numbers in ranges, like 10-50, ONLY WHOLE NUMBERS
        const rangeInteger = `${normalInteger}${normalDecimal}?\\s*-\\s*${normalInteger}${normalDecimal}?`;

        const integers = `(${[rangeInteger, normalInteger, smallInteger].join('|')})`;
        const decimals = `(${[normalDecimal, smallDecimal].join('|')})?`;

        return `(\-)?${integers}${decimals}`;
    }

    get regex() {
        if (this._regex) return this._regex;
        const s = /["+\-:|`^'& ,.<>()\\/\s*]/;
        const start = new RegExp(`(${s.source}|^)`).source;
        const end = new RegExp(`(${s.source}|$)`).source;
        const whitespace = /(\s*)/.source;
        const regex = [
            start,
            this._currencyRegex(),
            whitespace,
            this._amountRegex(),
            whitespace,
            this._currencyRegex(),
            end
        ].join('');
        if (this._browser.isFirefox())
            this._regex = XRegExp.cache(regex, 'gm');
        else
            this._regex = new RegExp(regex, 'gm');

        return this._regex;
    }

    /**
     * @param {*} element
     * @returns {[CurrencyElement]}
     */
    detectAll(element) {
        // Return empty list when not found
        const raw = element.innerText;
        if (!this.regex.test(raw)) return [];

        // Find currencies detectable in child nodes
        const children = element.children
        let result = [];
        for (let i = 0; i < children.length; i++)
            result = result.concat(this.detectAll(children[i]));

        // If no child contains full currency and we're at most 3 d
        if (result.length === 0 && !this._hasChildDeeperThan(element, 3))
            return [new CurrencyElement(element, {currencies: this._currencies, config: this._config})];
        return result;
    }

    /**
     * @param {*} element
     * @param {number} maxDepth
     * @returns {boolean}
     * @private
     */
    _hasChildDeeperThan(element, maxDepth) {
        if (!element) return maxDepth >= 0;
        const children = element.children
        for (let i = 0; i < children.length; i++)
            if (this._hasChildDeeperThan(children[i], maxDepth - 1))
                return true;
        return false;
    }

    // Has to be called EVERY time localization changes for a site
    updateSharedLocalizations() {
        this._localizationMapping['$'] = this._activeLocalization.dollar;
        this._localizationMapping['dollar'] = this._activeLocalization.dollar;
        this._localizationMapping['dollars'] = this._activeLocalization.dollar;
        this._localizationMapping['kr.'] = this._activeLocalization.krone;
        this._localizationMapping['kr'] = this._activeLocalization.krone;
        this._localizationMapping[',-'] = this._activeLocalization.krone;
        this._localizationMapping['¥'] = this._activeLocalization.yen;
    }

    async updateSymbols() {
        this._currencyTags = await this._currencies.symbols();
        console.log(this._currencyTags);
    }
}