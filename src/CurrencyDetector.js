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
     * @returns {{symbol:string, default: string, detected: string}[]}
     */
    localize(host = undefined, text = '') {
        return Localization.instance.analyze(this.currencies, text, host)
            .filter(e => e.default !== e.detected);
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

        const s = /["+\-'& ,.<>()\\/\s*]/;
        const start = new RegExp(`(${s.source}|^)`).source;
        const end = new RegExp(`(${s.source}|$)`).source;

        const whitespace = /(\s*)/.source;

        const currency = '(' + [
            /[¥A-Z]{3}\$?/.source,
            /,-{1,2}|kr\.?/.source,
            /CDN\$/.source,
            /US ?\$/.source,
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
        const rangeInteger = `${normalInteger}${normalDecimal}?\\s*-\\s*${normalInteger}${normalDecimal}?`;

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
        this._regex = this.regex;
        this._fullRegex = this.fullRegex;
    }

    /**
     * @returns {RegExp|XRegExp}
     */
    get regex() {
        return this._browser.isFirefox() ? XRegExp.cache(this.rawRegex, 'gm') : new RegExp(this.rawRegex, 'gm');
    }

    /**
     * @returns {RegExp|XRegExp}
     */
    get fullRegex() {
        return this._browser.isFirefox() ? XRegExp.cache(this.rawOnlyRegex, 'gs') : new RegExp(this.rawOnlyRegex, 'gs');
    }

    updateLocalizationCurrencies() {
        const site = Localization.instance.site;
        this.currencies['$'] = site.dollar;
        this.currencies['dollar'] = site.dollar;
        this.currencies['dollars'] = site.dollar;
        this.currencies['kr.'] = site.krone;
        this.currencies['kr'] = site.krone;
        this.currencies[',-'] = site.krone;
        this.currencies['¥'] = site.asian;
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

        let numbers = [];

        if (int.indexOf('-') >= 0) {
            numbers = int.split(/\s*-\s*/g)
                .map(e => {
                    const fullEnd = e.slice(-3);
                    const cutEnd = e.slice(-2);
                    let result;
                    if (/^[,.]\d$/.test(cutEnd))
                        result = `${e.substr(0, e.length - 2).replace(/[ ,.]*/g, '')}.${cutEnd.substr(1)}`;
                    else if (/^[,.]\d{2}$/.test(fullEnd))
                        result = `${e.substr(0, e.length - 3).replace(/[ ,.]*/g, '')}.${fullEnd.substr(1)}`;
                    else
                        result = e.replace(/[ ,.]*/g, '');
                    return result;
                }).map(e => Number(e));
        } else {
            int = int.replace(/[ ,.]*/g, '');
            dec = dec.replace(/[^\d]+/g, '');
            numbers = [Number(neg + int + '.' + dec)];
        }

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
            // Always move forward at least 1 position
            index = Math.max(index + 1, regex.lastIndex - 1);
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
            // Always move forward at least 1 position
            index = Math.max(index + 1, regex.lastIndex - 1);
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