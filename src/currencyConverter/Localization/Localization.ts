export class Localizations {
    private static _uniqueSymbols: Record<string, string>;

    static get uniqueSymbols() {
        if (this._uniqueSymbols) return this._uniqueSymbols;
        const result: Record<string, string> = {};
        const unique = Localizations.unique;
        Object.entries(unique).forEach(([key, value]) => value.forEach(symbol => result[symbol] = key))
        const shared = Localizations.shared;
        Object.entries(shared).forEach(([key, value]) => result[key] = value[0])
        return (this._uniqueSymbols = result)
    }

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
            ',--': ['SEK', 'DKK', 'NOK', 'ISK'],
            // China, Japan
            '¥': ['CNY', 'JPY']
        };
    }

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
            'JPY': ['JP¥', '円'],
            // China
            'CNY': ['CN¥', '元'],
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
}