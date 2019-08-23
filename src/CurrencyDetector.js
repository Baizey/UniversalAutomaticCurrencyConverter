let _CurrencyDetectorInstance;

class CurrencyDetector {

    /**
     * @return {CurrencyConverter}
     */
    static instance() {
        return _CurrencyDetectorInstance ? _CurrencyDetectorInstance : (_CurrencyDetectorInstance = new CurrencyDetector());
    }

    /**
     * @param {string} host
     * @param {string} text
     * @returns {{symbol:string, using: string, default: string}[]}
     */
    localize(host = undefined, text = '') {
        Localization.analyze(this.currencies, this.defaultLocalization, text, host);
        return [
            {
                symbol: '$',
                using: this.currencies['$'],
                default: this.storedDefaultLocalization.dollar,
            },
            {
                symbol: 'kr',
                using: this.currencies['kr'],
                default: this.storedDefaultLocalization.krone,
            },
            {
                symbol: '¥',
                using: this.currencies['¥'],
                default: this.storedDefaultLocalization.asian,
            }
        ].filter(e => e.using !== e.default);
    }

    get defaultLocalization() {
        const obj = {};
        obj[this.storedDefaultLocalization.dollar] = true;
        obj[this.storedDefaultLocalization.asian] = true;
        obj[this.storedDefaultLocalization.krone] = true;
        return obj;
    }

    constructor(browser = null) {
        this.storedDefaultLocalization = {
            dollar: 'USD',
            asian: 'CNY',
            krone: 'SEK'
        };
        this._browser = browser ? browser : Browser.instance();
        this._currencies = {
            HRK: 'HRK',
            HUF: 'HUF',
            EUR: 'EUR',
            IDR: 'IDR',
            PHP: 'PHP',
            TRY: 'TRY',
            RON: 'RON',
            ISK: 'ISK',
            SEK: 'SEK',
            THB: 'THB',
            PLN: 'PLN',
            GBP: 'GBP',
            CAD: 'CAD',
            AUD: 'AUD',
            MYR: 'MYR',
            NZD: 'NZD',
            CHF: 'CHF',
            DKK: 'DKK',
            SGD: 'SGD',
            CNY: 'CNY',
            BGN: 'BGN',
            CZK: 'CZK',
            BRL: 'BRL',
            JPY: 'JPY',
            KRW: 'KRW',
            INR: 'INR',
            MXN: 'MXN',
            RUB: 'RUB',
            HKD: 'HKD',
            USD: 'USD',
            ZAR: 'ZAR',
            ILS: 'ILS',
            NOK: 'NOK'
        };

        const s = /["+\-' ,.<>()\\/\s]/;
        const start = new RegExp(`(${s.source}|^)`).source;
        const end = new RegExp(`(${s.source}|$)`).source;

        const whitespace = /(\s*)/.source;

        const currency = '(' + [
            /[¥A-Z]{3}/.source,
            /,-{1,2}|kr\.?/.source,
            /CDN\$/.source,
            /dollars?/.source,
            /[$£€₺Ł元₿Ξ฿₴ɱ₽¥₩]/.source,
        ].join('|') + ')?';

        // Find normal numbers
        const normalInteger = /(?:(?:\d{1,3}?(?:[., ]\d{3})*)|\d{4,})/.source;
        const normalDecimal = /(?:\s*[.,]\s*(?:\d{1,2}|-{2}))/.source;

        // Find small decimal numbers
        const smallInteger = /(?:0)/.source;
        const smallDecimal = /(?:[,.]\d+)/.source;

        // Find numbers in ranges, like 10-50, ONLY WHOLE NUMBERS
        const rangeInteger = `${normalInteger}-${normalInteger}`;

        const integers = `(${[rangeInteger, normalInteger, smallInteger].join('|')})`;
        const decimals = `(${[normalDecimal, smallDecimal].join('|')})?`;

        const numberSource = `(\-)?${integers}${decimals}`;

        this.rawRegex = [
            start,
            currency,
            whitespace,
            numberSource,
            whitespace,
            currency,
            end
        ].join('');
        this.rawOnlyRegex = [
            /(^)/.source,
            currency,
            whitespace,
            numberSource,
            whitespace,
            currency,
            /($)/.source].join('');
    }

    get _regex() {
        return this._browser.isFirefox() ? XRegExp.cache(this.rawRegex, 'gm') : new RegExp(this.rawRegex, 'gm');
    }

    get _fullRegex() {
        return this._browser.isFirefox() ? XRegExp.cache(this.rawOnlyRegex, 'gs') : new RegExp(this.rawOnlyRegex, 'gs');
    }

    /**
     * @param text
     * @param regex
     * @param lastIndex
     * @return {SearchResult|null}
     * @private
     */
    findResult(text, regex, lastIndex = 0) {
        regex.lastIndex = lastIndex;

        const result = regex.exec(text);
        if (!result) return null;

        let [raw, start, c1, w1, neg, int, dec, w2, c2, end] = result;

        neg = neg ? neg : '';
        dec = dec ? dec : '';

        int = int.replace(/[ ,.]*/g, '');
        dec = dec.replace(/[^\d]+/g, '');
        let numbers = [Number(neg + int + '.' + dec)];
        if (int.indexOf('-') >= 0)
            numbers = int.split('-').map(e => Number(e));

        let currency;
        if (this.currencies[c2]) {
            currency = this.currencies[c2];
            c1 = c1 ? c1 : '';
            if (!this.currencies[c1])
                start += c1;
        } else if (this.currencies[c1]) {
            currency = this.currencies[c1];
            c2 = c2 ? c2 : '';
            if (!this.currencies[c2])
                end = c2 + end;
        }

        return new SearchResult(raw, start, w1, w2, end, numbers, currency, result.index);
    }

    /**
     * @param {string|HTMLElement} text
     * @param {boolean} expectOnlyCurrency
     * @return {SearchResult[]}
     */
    findAll(text, expectOnlyCurrency = false) {
        if (typeof text !== 'string')
            text = text.innerText;

        if (expectOnlyCurrency)
            return [this.findResult(text, this._fullRegex)].filter(e => e && e.currency);

        const result = [];
        let index = 0;
        const found = true;
        const regex = this._regex;
        while (found) {
            const r = this.findResult(text, regex, index);
            if (!r) break;
            if (r.currency)
                result.push(r);
            index = regex.lastIndex - 1;
        }
        return result;
    }

    /**
     * @param {string|HTMLElement} text
     * @param {boolean} expectOnlyCurrency
     * @return {boolean}
     */
    contains(text, expectOnlyCurrency = false) {
        if (typeof text !== 'string')
            text = text.innerText;

        if (expectOnlyCurrency) {
            const resp = this.findResult(text, this._fullRegex);
            return resp && !!resp.currency;
        }
        let index = 0;
        const regex = this._regex;
        while (true) {
            const r = this.findResult(text, regex, index);
            if (!r) return false;
            if (r.currency) return true;
            index = regex.lastIndex;
        }
    }

    /**
     * @param {object} currencies
     * @return {CurrencyDetector}
     */
    updateWithMoreCurrencies(currencies) {
        Object.keys(currencies).forEach(key => this._currencies[key] = currencies[key]);
        return this;
    }

    withDefaultLocalization(currency) {
        if (Utils.isUndefined(currency)) return;
        const isDollar = ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'].indexOf(currency) >= 0;
        if (isDollar)
            return this.storedDefaultLocalization.dollar = currency;

        const isKrone = ['SEK', 'DKK', 'NOK', 'ISK', 'CZK'].indexOf(currency) >= 0;
        if (isKrone)
            return this.storedDefaultLocalization.krone = currency;

        const isAsian = ['CNY', 'JPY'].indexOf(currency) >= 0;
        if (isAsian)
            return this.storedDefaultLocalization.asian = currency;
    }

    get currencies() {
        return this._currencies;
    }

}

class SearchResult {

    /**
     * @param {string} raw
     * @param {string}  start
     * @param {string}  w1
     * @param {string}  w2
     * @param {string} end
     * @param {number|number[]} numbers
     * @param {string}  currency
     * @param {number} index
     */
    constructor(raw, start, w1, w2, end, numbers, currency, index) {
        this.index = index;
        this.numbers = Array.isArray(numbers) ? numbers : [numbers];
        this.currency = currency;
        this._raw = raw;

        this._w1 = w1;
        this._w2 = w2;
        this._start = start;
        this._end = end;
    }

    hasCurrency() {
        return Utils.isDefined(this.currency);
    }

    get raw() {
        return this._raw;
    }

    /**
     * @param {function(a:string, b:string)} numberStyler
     * @return {string}
     */
    result(numberStyler) {
        return '' + numberStyler(this.numbers.join('-'), this.currency);
    }

}