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
     */
    localize(host = undefined, text = '') {
        Localization.analyze(this.currencies, text, host);
    }

    constructor(browser = null) {
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

        const s = /["+\-',.<>()\/\s]/;
        const start = new RegExp(`(${s.source}|^)`);
        const end = new RegExp(`(${s.source}|$)`);

        const whitespace = /(\s*)/;
        const currency = /([¥a-zA-Z.,-]{2,3}|[$£€₺Ł元₿Ξ฿₴ɱ₽¥₩]|dollars?)?/;
        const negation = /(-)?/;
        const integer = /((?:\d{1,3}?(?:[., ]\d{3})*)|\d{4,})/;
        const decimal = /(?:\s*[., ]\s*(\d{1,2}|-{2}))?/;

        const rawRegex = [
            start.source,
            currency.source,
            whitespace.source,
            negation.source,
            integer.source,
            decimal.source,
            whitespace.source,
            currency.source,
            end.source
        ].join('');
        const rawOnlyRegex = [
            /(^)/.source,
            currency.source,
            whitespace.source,
            negation.source,
            integer.source,
            decimal.source,
            whitespace.source,
            currency.source,
            /($)/.source].join('');

        this._regex =
            this._browser.isFirefox() ? XRegExp.cache(rawRegex, 'gm') : new RegExp(rawRegex, 'gm');
        this._fullRegex =
            this._browser.isFirefox() ? XRegExp.cache(rawOnlyRegex, 'gs') : new RegExp(rawOnlyRegex, 'gs');
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
        int = int.replace(/[ ,.]*/g, '');
        dec = dec ? `.${dec}` : '';

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

        return new SearchResult(raw, start, w1, w2, end, neg + int + dec, currency);
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
            return [this.findResult(text, this._fullRegex)].filter(e => e);

        const result = [];
        let index = 0;
        const found = true;
        while (found) {
            const r = this.findResult(text, this._regex, index);
            if (!r) break;
            if (r.currency)
                result.push(r);
            index = this._regex.lastIndex;
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
        while (true) {
            const r = this.findResult(text, this._regex, index);
            if (!r) return false;
            if (r.currency) return true;
            index = this._regex.lastIndex;
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

    get currencies() {
        return this._currencies;
    }

}

class SearchResult {

    constructor(raw, start, w1, w2, end, number, currency) {
        this.number = Number(number);
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
     * @param {function(a:number, b:string)} numberStyler
     * @return {string}
     */
    result(numberStyler) {
        return `${this._start}${this._w1}${numberStyler(this.number, this.currency)}${this._w2}${this._end}`
    }

}