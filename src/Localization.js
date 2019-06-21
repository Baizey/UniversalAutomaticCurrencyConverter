let _LocalizationInstance;

class Localization {

    static instance() {
        return _LocalizationInstance ? _LocalizationInstance : (_LocalizationInstance = new Localization());
    }

    /**
     * @param {object} currencies
     * @param {string} text
     * @param {string} host
     * @return {*}
     */
    static analyze(currencies, text, host = undefined) {
        return Localization.instance().analyze(currencies, text, host);
    }

    constructor() {
        this.lookup = {
            // Usa, Canada, Australia, Mexico, New Zealand, Singapore, Hong kong
            '$': ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            'dollar': ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            'dollars': ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            // Denmark, Sweden,  Norway, Island, Czechia
            'kr.': ['DKK', 'SEK', 'NOK', 'ISK', 'CZK'],
            'kr': ['DKK', 'SEK', 'NOK', 'ISK', 'CZK'],
            ',-': ['DKK', 'SEK', 'NOK', 'ISK', 'CZK'],
            '€': ['EUR'],
            '£': ['GBP'],
            // China, Japan
            '¥': ['CNY', 'JPY'],
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
        this.hostToCurrency = {
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
     * @param {string} host
     * @return {*}
     */
    count(currencies, text) {
        const counter = Object.keys(currencies).reduce((a, b) => (a[b] = 0) || a, {});

        const regex = /(?:^|[\W_])([A-Z]{3})(?:$|[\W_])/g;
        do {
            regex.lastIndex--;
            const resp = regex.exec(text);
            if (!resp) break;
            let [, currency] = resp;
            if (typeof counter[currency] !== 'number') continue;
            counter[currency]++;
        } while (true);
        return counter;
    }

    /**
     * @param {object} currencies
     * @param {string} text
     * @param {string} host
     * @return {*}
     */
    analyze(currencies, text, host = undefined) {
        host = host ? host : Browser.getHost();
        const counter = Object.keys(currencies)
            .reduce((a, b) => (a[b] = 0) || a, {});

        // If host is found it will give default bonus assertion,
        // otherwise USD will always be seen as default
        host = this.hostToCurrency[host] || 'USD';
        counter[host] = 1;

        const regex = /(?:^|[\W_])([A-Z]{3})(?:$|[\W_])/g;
        do {
            regex.lastIndex--;
            const resp = regex.exec(text);
            if (!resp) break;
            let [, currency] = resp;
            if (typeof counter[currency] !== 'number') continue;
            counter[currency]++;
        } while (true);

        Object.keys(this.lookup).forEach(key => {
            const countries = this.lookup[key];
            if (countries.length === 1)
                return currencies[key] = countries[0];
            const score = countries.map(e => counter[e]).map(e => e ? e : -1);
            const max = score.indexOf(Math.max(...score));
            currencies[key] = countries[max];
        });
    }

}