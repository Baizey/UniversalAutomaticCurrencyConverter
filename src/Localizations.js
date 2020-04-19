let _currencySymbolsCache = null;

class Localizations {

    /**
     * @returns {{",-": [string, string, string, string], $: string[], ¥: [string, string], "kr.": [string, string, string, string, string], kr: [string, string, string, string, string], dollars: string[], dollar: string[]}}
     */
    static get shared() {
        return {
            // Usa, Canada, Australia, Mexico, New Zealand, Singapore, Hong kong
            '$': ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            'dollar': ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            'dollars': ['USD', 'CAD', 'AUD', 'MXN', 'NZD', 'SGP', 'HKD'],
            // Denmark, Sweden,  Norway, Island, Czechia
            'kr.': ['SEK', 'DKK', 'NOK', 'ISK', 'CZK'],
            'kr': ['SEK', 'DKK', 'NOK', 'ISK', 'CZK'],
            ',-': ['SEK', 'DKK', 'NOK', 'ISK'],
            // China, Japan
            '¥': ['CNY', 'JPY']
        };
    }

    /**
     * @returns {{MXN: [string], EUR: [string], USD: [string, string, string], CAD: [string], BGN: [string], INR: [string], CNY: [string], THB: [string], AUD: [string], BTC: [string], KRW: [string], JPY: [string], PLN: [string], GBP: [string], CZK: [string], ETH: [string], NZD: [string], TRY: [string], LTC: [string], XMR: [string], UAH: [string], RUB: [string]}}
     */
    static get unique() {
        return {
            // Australia
            'AUD': ['AUD$'],
            // Brazil
            'BRL': ['R$'],
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
    }

    /**
     * @returns {{no: string, ru: string, hk: string, in: string, bg: string, jp: string, kr: string, dk: string, is: string, cn: string, mx: string, ua: string, nz: string, se: string, th: string, au: string, sg: string, uk: string, cz: string, pl: string, tr: string, ca: string}}
     */
    static get hostCurrency() {
        return {
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

    static get allUniqueLocalizationMappings() {
        if (!_currencySymbolsCache) {
            const result = {};
            const unique = Localizations.unique;
            for (let i in unique) {
                const symbols = unique[i];
                for (let s in symbols)
                    if (symbols.hasOwnProperty(s))
                        result[symbols[s]] = i
            }
            _currencySymbolsCache = result;
        }

        return _currencySymbolsCache;
    }

    /**
     * @param {string} localizedCurrency
     * @returns {string[]}
     */
    static mapToCurrency(localizedCurrency) {
        return Localizations.allLocalizationMappings[localizedCurrency] || [localizedCurrency];
    }
}