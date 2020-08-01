let _browserMockInstance;

class Browser {
    static get instance() {
        if (!_browserMockInstance) _browserMockInstance = new Browser();
        return _browserMockInstance;
    }

    constructor() {
        const useragent = window.navigator.userAgent;
        if (useragent.indexOf('HeadlessChrome') >= 0)
            this.type = 'Chrome';
        else
            this.type = 'Firefox'
        console.log(`UACC: Detected ${this.type} browser`);
    }

    /**
     * @param key
     * @param value
     * @returns {Promise<void>}
     */
    async saveLocal(key, value = null) {
    }

    /**
     * @param keys
     * @returns {Promise<{}>}
     */
    async loadLocal(keys) {
        return {};
    }

    /**
     * @returns {boolean}
     */
    get isFirefox() {
        return this.type === 'Firefox';
    }

    get background() {
        return {
            getRate: async (from, to) => {
                if (from === to) return {rate: 1};
                throw 'unimplemented getRate mock for different currencies through api'
            },
            getSymbols: async () => ({
                'USD': 'USD',
                'AUD': 'AUD',
                'SEK': 'SEK',
                // Brazil
                'BRL': 'BRL',
                // New Zealand
                'NZD': 'NZD',
                // Canada
                'CAD': 'CAD',
                // Mexico
                'MXN': 'MXN',
                // EU
                'EUR': 'EUR',
                // UK
                'GBP': 'GBP',
                // Japan
                'JPY': 'JPY',
                // China
                'CNY': 'CNY',
                // India
                'INR': 'INR',
                // Russia
                'RUB': 'RUB',
                // Turkey
                'TRY': 'TRY',
                // Ukraine
                'UAH': 'UAH',
                // Thailand
                'THB': 'THB',
                // Poland
                'PLN': 'PLN',
                // South Korea
                'KRW': 'KRW',
                // Bulgaria
                'BGN': 'BGN',
                // Czechia
                'CZK': 'CZK',
                // Bitcoin
                'BTC': 'BTC',
                // Monero
                'XMR': 'XMR',
                // Ethereum
                'ETH': 'ETH',
                // Litecoin
                'LTC': 'LTC'
            })

        }
    }
}