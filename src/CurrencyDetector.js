let _CurrencyDetectorInstance;

class CurrencyDetector {

    /**
     * @return {CurrencyConverter}
     */
    static instance() {
        return _CurrencyDetectorInstance ? _CurrencyDetectorInstance : (_CurrencyDetectorInstance = new CurrencyDetector());
    }

    /**
     * @param {CurrencyDetector} instance
     * @param {string|null} givenHost
     */
    static localize(instance, givenHost = null) {
        const hostname = window.location.hostname;
        const index = hostname.lastIndexOf('.');
        const host = givenHost ? givenHost
            : (index >= 0 && hostname.length >= index + 1
                ? hostname.substr(hostname.lastIndexOf('.') + 1)
                : null);


        instance.currencies['dollar'] = 'USD';
        instance.currencies['dollars'] = 'USD';

        switch (host) {
            case 'dk':
                instance.currencies['kr.'] = 'DKK';
                instance.currencies['kr'] = 'DKK';
                instance.currencies[',-'] = 'DKK';
                break;
            case 'se':
                instance.currencies['kr.'] = 'SEK';
                instance.currencies['kr'] = 'SEK';
                instance.currencies[',-'] = 'SEK';
                break;
            case 'no':
                instance.currencies['kr.'] = 'NOK';
                instance.currencies['kr'] = 'NOK';
                instance.currencies[',-'] = 'NOK';
                break;
            case 'ca':
                instance.currencies['dollar'] = 'CAD';
                instance.currencies['dollars'] = 'CAD';
                instance.currencies['$'] = 'CAD';
                break;
            case 'au':
                instance.currencies['dollar'] = 'AUD';
                instance.currencies['dollars'] = 'AUD';
                instance.currencies['$'] = 'AUD';
                break;
            case 'jp':
                instance.currencies['¥'] = 'JPY';
                break;
            case 'mx':
                instance.currencies['$'] = 'MXN';
                break;
        }
    }

    constructor(browser = null) {
        this._browser = browser ? browser : Browser.instance();
        this._currencySymbols = {
            '£': 'GBP', // UK
            '€': 'EUR', // EU
            '$': 'USD', // US (or mexico localized)
            '₽': 'RUB', // Russia
            '¥': 'CNY', // China (or Japan localized)
            '₩': 'KRW', // S. Korea
        };
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
        this.updateWithMoreCurrencies(this._currencySymbols);
        CurrencyDetector.localize(this);


        const s = /["+\-',.<>()\/\s]/;
        const start = new RegExp(`(${s.source}|^)`);
        const end = new RegExp(`(${s.source}|$)`);

        const whitespace = /(\s*)/;
        const currency = /([a-zA-Z.,-]{2,3}|[$£€₽¥₩]|dollars?)?/;
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
        if (!c1)
            currency = c2;
        else if (!c2)
            currency = c1;
        else
            currency = this.currencies[c2] ? c2 : c1;

        currency = this.currencies[currency];

        return new SearchResult(raw, start, w1, w2, end, neg + int + dec, currency);
    }

    /**
     * @param {string|Element} text
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
     * @param {string|Element} text
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