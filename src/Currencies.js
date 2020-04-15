let _currenciesInstance = null;

class Currencies {
    /**
     * @returns {Currencies}
     */
    static get instance() {
        if (!_currenciesInstance) _currenciesInstance = new Currencies();
        return _currenciesInstance;
    }

    /**
     * @param {{browser: Browser}} services
     */
    constructor(services = {}) {
        this._rates = {}
        this._symbols = null;
        this._browser = services.browser || Browser.instance;
    }

    /**
     * @param {boolean} forceUpdate
     * @returns {Promise<string[]>}
     */
    async symbols(forceUpdate = false) {
        if (forceUpdate || !this._symbols) await this._fetchSymbols(forceUpdate);
        return this._symbols;
    }

    /**
     * @param {string} from
     * @param {string} to
     * @returns {Promise<CurrencyRate>}
     */
    async getRate(from, to) {
        if (!this._rates[from] || !this._rates[from][to] || this._rates[from][to].isExpired)
            await this._fetchRate(from, to);
        return this._rates[from][to];
    }

    /**
     * @returns {Promise<void>}
     * @private
     */
    async _fetchRate(from, to) {
        this._rates[from] = this._rates[from] || {};
        const rateKey = `uacc:rate:${from}:${to}`;
        const dateKey = `uacc:rate:date:${from}:${to}`;

        // Get rate from local storage if valid
        const storage = await this._browser.loadLocal([rateKey, dateKey]);
        const rate = storage[rateKey];
        const date = storage[dateKey];
        const storedCurrencyRate = new CurrencyRate(from, to, rate, date);
        if (!storedCurrencyRate.isExpired) {
            this._rates[from][to] = storedCurrencyRate;
            return;
        }

        // Otherwise call API to get new rate
        // TODO: handle error better
        const resp = await this._browser.background.getRate(from, to).then(e => e.rate).catch(error => null);
        if (!resp) return;

        this._rates[from][to] = new CurrencyRate(from, to, Number(resp), Date.now());
        await this._browser.saveLocal({[rateKey]: Number(resp), [dateKey]: Date.now()}, null);
    }

    /**
     * @param {boolean} forceUpdate
     * @returns {Promise<void>}
     * @private
     */
    async _fetchSymbols(forceUpdate) {
        const symbolsKey = `uacc:symbols`;
        const dateKey = `uacc:symbols:date`;

        // Get symbols from local storage if valid
        const storage = await this._browser.loadLocal([symbolsKey, dateKey]);
        const symbols = storage[symbolsKey];
        const diff = Date.now() - (storage[dateKey] || 1);
        // Symbols rarely changes, but they do change, force update once a week
        if (!forceUpdate && diff < 1000 * 60 * 60 * 24 * 7) {
            this._symbols = symbols;
            return;
        }

        // Otherwise call API to get new symbols list
        // TODO: handle error better
        const resp = await this._browser.background.getSymbols().catch(error => null);
        console.log(resp)
        if (!resp) return;
        this._symbols = resp;
        await this._browser.saveLocal({[symbolsKey]: this._symbols, [dateKey]: Date.now()}, null);
    }
}