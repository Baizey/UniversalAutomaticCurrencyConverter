let _LocalizationInstance;

class Localization {

    static instance() {
        return _LocalizationInstance ? _LocalizationInstance : (_LocalizationInstance = new Localization());
    }

    /**
     * @param {object} currencies
     * @param {object} defaults
     * @param {string} text
     * @param {string} host
     * @return {*}
     */
    static analyze(currencies, defaults, text, host = undefined) {
        return Localization.instance().analyze(currencies, defaults, text, host);
    }

    constructor() {
        this.lookup = {
            // Usa, Canada, Australia, Mexico, New Zealand, Singapore, Hong kong
            '$': ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            'dollar': ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            'dollars': ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            // Denmark, Sweden,  Norway, Island, Czechia
            'kr.': ['SEK', 'DKK', 'NOK', 'ISK', 'CZK'],
            'kr': ['SEK', 'DKK', 'NOK', 'ISK', 'CZK'],
            ',-': ['SEK', 'DKK', 'NOK', 'ISK', 'CZK'],
            '€': ['EUR'],
            '£': ['GBP'],
            // China, Japan
            '¥': ['CNY', 'JPY'],
            // Japan
            'JP¥': ['JPY'],
            // China
            '元': ['CNY'],
            // India
            '₹': ['INR'],
            // Russia
            '₽': ['RUB'],
            // Turkey
            '₺': ['TRY'],
            // Ukraine
            '₴': ['UAH'],
            // Thailand
            '฿': ['THB'],
            // Poland
            'zł': ['PLN'],
            // South Korea
            '₩': ['KRW'],
            // Bulgaria
            'лв': ['BGN'],
            // Czechia
            'Kč': ['CZK'],
            // Bitcoin
            '₿': ['BTC'],
            // Monero
            'ɱ': ['XMR'],
            // Ethereum
            'Ξ': ['ETH'],
            // Litecoin
            'Ł': ['LTC']
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
     * @param {object} defaults
     * @param {string} text
     * @param {string} host
     * @return {*}
     */
    analyze(currencies, defaults, text, host = undefined) {
        host = this.hostToCurrency(host);
        const counter = this.count(currencies, text);

        // Host gives edges if nothing else is found on the site
        if (typeof counter[host] === 'number')
            counter[host] += 1;

        Object.keys(this.lookup).forEach(key => {
            const countries = this.lookup[key];
            if (countries.length === 1)
                return currencies[key] = countries[0];
            const score = countries.map(e => counter[e]).map(e => e ? e : -1);
            const firstMax = score.indexOf(Math.max(...score));
            const lastMax = score.lastIndexOf(Math.max(...score));

            if (lastMax === firstMax)
                currencies[key] = countries[firstMax];
            else {
                let foundDefault = false;
                for (let i = firstMax; i < lastMax + 1; i++) {
                    if (score[firstMax] === score[i] && defaults[countries[i]]) {
                        currencies[key] = countries[i];
                        foundDefault = true;
                        break;
                    }
                }
                if (!foundDefault)
                    currencies[key] = countries[firstMax];
            }
        });
    }

}