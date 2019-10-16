let _LocalizationInstance;

class Localization {

    static get instance() {
        return _LocalizationInstance ? _LocalizationInstance : (_LocalizationInstance = new Localization());
    }

    /**
     * @param {object} currencies
     * @param {string} text
     * @param {string} host
     * @returns {{symbol: string, default: string, detected: string}[]}
     */
    static analyze(currencies, text, host = undefined) {
        return Localization.instance.analyze(currencies, text, host);
    }

    constructor() {
        this.site = new SiteLocalization();
        this.shared = {
            // Usa, Canada, Australia, Mexico, New Zealand, Singapore, Hong kong
            '$':        ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            'dollar':   ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            'dollars':  ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            // Denmark, Sweden,  Norway, Island, Czechia
            'kr.':  ['SEK', 'DKK', 'NOK', 'ISK', 'CZK'],
            'kr':   ['SEK', 'DKK', 'NOK', 'ISK', 'CZK'],
            ',-':   ['SEK', 'DKK', 'NOK', 'ISK'],
            // China, Japan
            '¥': ['CNY', 'JPY']
        };
        this.unique = {
            // Australia
            'AUD': ['AUD$'],
            // New Zealand
            'NZD': ['NZD$'],
            // USA
            'USD': ['USD$', 'US$', 'US $'],
            // Canada
            'CAD': ['CDN$'],
            // Mexico
            'MXN': ['MXN$'],
            // EU
            'EUR': ['€'],
            // UK
            'GBP': ['£'],
            // Japan
            'JPY': ['JP¥'],
            // China
            'CNY': ['元'],
            // India
            'INR': ['₹'],
            // Russia
            'RUB': ['₽'],
            // Turkey
            'TRY': ['₺'],
            // Ukraine
            'UAH': ['₴'],
            // Thailand
            'THB': ['฿'],
            // Poland
            'PLN': ['zł'],
            // South Korea
            'KRW': ['₩'],
            // Bulgaria
            'BGN': ['лв'],
            // Czechia
            'CZK': ['Kč'],
            // Bitcoin
            'BTC': ['₿'],
            // Monero
            'XMR': ['ɱ'],
            // Ethereum
            'ETH': ['Ξ'],
            // Litecoin
            'LTC': ['Ł']
        };
        this._hostToCurrency = {
            'cn': 'CNY',
            'jp': 'JPY',
            'in': 'INR',
            'ru': 'RUB',
            'tr': 'TRY',
            'ua': 'UAH',
            'th': 'THB',
            'pl': 'PLN',
            'kr': 'KRW',
            'bg': 'BGN',
            'dk': 'DKK',
            'se': 'SEK',
            'no': 'NOK',
            'is': 'ISK',
            'cz': 'CZK',
            'ca': 'CAD',
            'au': 'AUD',
            'mx': 'MXN',
            'nz': 'NZD',
            'sg': 'SGP',
            'hk': 'HKD',
            'uk': 'GBP',
        }
    }

    /**
     * @param {object} currencies
     * @param {string} text
     * @return {*}
     */
    count(currencies, text) {
        const counter = Object.keys(currencies).reduce((a, b) => (a[b] = 0) || a, {});
        const regex = /(?:^|[\W_])([A-Z]{3})(?:$|[\W_])/g;
        do {
            regex.lastIndex--;
            const resp = regex.exec(text);
            if (!resp) break;
            const [, currency] = resp;
            if (typeof counter[currency] !== 'number') continue;
            counter[currency]++;
        } while (true);
        return counter;
    }

    hostToCurrency(givenHost) {
        const host = givenHost ? givenHost : Browser.getHost();
        return this._hostToCurrency[host] || 'unknown';
    }

    /**
     * @param {object} currencies
     * @param {string} text
     * @param {string} host
     * @returns {{symbol: string, default: string, detected: string}[]}
     */
    analyze(currencies, text, host = undefined) {
        const result = [
            {
                symbol: this.site.symbols.dollar,
                default: this.site.dollar,
                detected: this.site.dollar
            },
            {
                symbol: this.site.symbols.krone,
                default: this.site.krone,
                detected: this.site.krone
            },
            {
                symbol: this.site.symbols.asian,
                default: this.site.asian,
                detected: this.site.asian
            },
        ];

        const defaultLookup = this.site.forLookup;
        Object.keys(this.unique).forEach(key => this.unique[key].forEach(u => currencies[u] = key));

        // If user has forced localization it is respected
        if (!this.site.isOverrideable) {
            Object.keys(this.shared).forEach(key => {
                const countries = this.shared[key];
                currencies[key] = countries.filter(e => defaultLookup[e])[0];
            });
            return result;
        } else {
            host = this.hostToCurrency(host);
            const counter = this.count(currencies, text);

            // Host gives edges if nothing else is found on the site
            if (typeof counter[host] === 'number')
                counter[host] += 1;

            Object.keys(this.shared).forEach(key => {
                const countries = this.shared[key];
                const score = countries.map(e => counter[e] || -1);
                let best = 0;
                let hasDefault = undefined;
                for (let i = 0; i < score.length; i++) {
                    if (defaultLookup[countries[i]])
                        hasDefault = countries[i];
                    if ((score[i] > score[best]) || (score[i] === score[best] && defaultLookup[countries[i]]))
                        best = i;
                }
                if (hasDefault)
                    result
                        .filter(e => e.default === hasDefault)
                        .forEach(e => e.detected = countries[best]);
                currencies[key] = countries[best];
            });
        }

        return result;
    }

}