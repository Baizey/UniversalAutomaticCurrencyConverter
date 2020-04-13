class CurrencyAmount {
    /**
     * @param {string} tag
     * @param {number} amount
     * @param {{config: Configuration, currencies: Currencies}} services
     */
    constructor(tag, amount = 0, services = {}) {
        this._config = services.config || Configuration.instance;
        this._converter = services.currencies || Currencies.instance;
        this._tag = tag.toUpperCase();
        this._amount = amount;
    }

    /**
     * @returns {string}
     */
    get tag() {
        return this._tag;
    }

    /**
     * @returns {number}
     */
    get amount() {
        return this._amount;
    }

    /**
     * @returns {string}
     */
    get roundedAmount() {
        const significant = this._config.display.rounding.value;
        let fixed = this.amount;

        // TODO: custom tag value
        const usingCustom = this._config.tag.using.value;
        if (usingCustom) {
            const factor = this._config.tag.value.value;
            if (factor !== 1) {
                fixed *= this._config.tag.value.value;
            }
        }

        // Limit at 15 decimals, as anything more causes issues with .toFixed
        if (Math.abs(fixed) < 1e-15) return '0';
        const original = fixed.toFixed(15);
        const [integers, decimals] = original.split('.');
        if (integers === '0' || integers === '-0') {
            let i = 0;
            while (i < decimals.length && decimals[i] === '0') i++;
            if (i === decimals.length) return '0';
            return '0.' + '0'.repeat(i) + this._round(decimals, i + Math.min(2, significant));
        } else {
            const keep = fixed < 0 ? significant + 1 : significant;
            if (keep > integers.length) {
                const rounded = this._round(decimals, Math.min(2, keep - integers.length));
                return rounded === 0 ? integers : `${integers}.${rounded}`;
            } else if (keep === integers.length)
                return String(Math.round(Number(original)));
            else
                return this._round(integers, keep) + '0'.repeat(integers.length - keep);
        }
    }

    /**
     * @param {string} number
     * @param {number} split
     * @returns {number}
     * @private
     */
    _round(number, split) {
        const start = number.substr(0, split);
        const digit = number[split] || 1;
        return Math.round(Number(`${start}.${digit}`));
    }

    /**
     * @param {string} tag
     */
    async convertTo(tag) {
        tag = tag.toUpperCase();
        const rate = await this._converter.getRate(this.tag, tag);
        this._amount *= rate.rate;
        this._tag = tag;
    }

    /**
     * @returns {string}
     */
    toString() {
        const [integers, digits] = this.roundedAmount;
        const decimal = this._config.display.decimal.value;
        const thousands = this._config.display.thousands.value;
        const leftSide = integers.split(/(?=(?:.{3})*$)/).join(thousands);
        const value = leftSide + (digits ? (decimal + digits) : '')

        const usingCustom = this._config.tag.using.value;
        if (!usingCustom) return `${value} ${this.tag}`;

        const customTag = this._config.tag.display.value;
        return customTag.value.replace('¤', value);
    }
}