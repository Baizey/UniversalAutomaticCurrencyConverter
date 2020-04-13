let _currenciesInstance = null;

class Currencies {
    /**
     * @returns {Currencies}
     */
    static get instance() {
        if (!_currenciesInstance) _currenciesInstance = new Currencies();
        return _currenciesInstance;
    }

    constructor() {
        this._rates = {}
        this._symbols = null;
    }

    /**
     * @returns {Promise<string[]>}
     */
    async get symbols() {
        if (!this._symbols) await this._fetchSymbols();
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
        this._rates[from][to] = new CurrencyRate(from, to, NaN, new Date());
        throw 'unimplemented'
    }

    async _fetchSymbols() {
        this._symbols = [];
        throw 'unimplemented'
    }
}