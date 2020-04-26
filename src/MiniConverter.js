let _miniConverterInstance;

class MiniConverter {
    /**
     * @returns {MiniConverter}
     */
    static get instance() {
        if (!_miniConverterInstance) _miniConverterInstance = new MiniConverter();
        return _miniConverterInstance;
    }

    /**
     * @param {{browser: Browser, config: Configuration}}services
     */
    constructor(services = {}) {
        this._browser = services.browser || Browser.instance;
        this._config = services.config || Configuration.instance;
        this._conversions = [];
        this._converterKey = 'uacc:global:converter'
    }

    /**
     * @returns {Promise<MiniConverterRow>}
     */
    async addNewRow() {
        const currency = this._config.currency.tag.value;
        const row = new MiniConverterRow(currency, currency, 0);
        this._conversions.push(row);
        await this.save();
        return row;
    }

    /**
     * @param {MiniConverterRow} row
     */
    async remove(row) {
        this._conversions = this._conversions.filter(e => !e.isMe(row));
        await this.save();
    }

    /**
     * @returns {[MiniConverterRow]}
     */
    get conversions() {
        return this._conversions
    }

    /**
     * @returns {Promise<void>}
     */
    async save() {
        await this._browser.saveLocal(this._converterKey, this.conversions);
    }

    /**
     * @returns {Promise<void>}
     */
    async load() {
        this._conversions = (await this._browser.loadLocal(this._converterKey).then(e => e[this._converterKey])) || [];
        this._conversions = this._conversions.map(e => new MiniConverterRow(e.from, e.to, e.amount));
    }

}

let nextId = 1;

class MiniConverterRow {
    /**
     * @param {string} from
     * @param {string} to
     * @param {number} amount
     */
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this._id = nextId++;
    }

    /**
     * @param {MiniConverterRow} row
     * @returns {boolean}
     */
    isMe(row) {
        return this._id === row._id;
    }

    /**
     * @returns {Promise<CurrencyAmount>}
     */
    async convertedValue() {
        const amount = new CurrencyAmount(this.from, this.amount);
        return await amount.convertTo(this.to);
    }
}