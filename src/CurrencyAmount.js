class CurrencyAmount {
    /**
     * @param {string} tag
     * @param {number|[number]} amount
     * @param {{config: Configuration, currencies: Currencies}} services
     */
    constructor(tag, amount = 0, services = {}) {
        services.config = services.config || Configuration.instance
        services.currencies = services.currencies || Currencies.instance
        const config = services.config;
        this._display = config.display;
        this._tagConfig = config.tag;
        this._converter = services.currencies;
        this._services = services;
        this._tag = tag.toUpperCase();
        this._amount = Array.isArray(amount) ? amount : [amount];
    }

    /**
     * @returns {string}
     */
    get tag() {
        return this._tag;
    }

    /**
     * @returns {[number]}
     */
    get amount() {
        return this._amount;
    }

    /**
     * @returns {[string]}
     */
    get roundedAmount() {
        const significant = this._display.rounding.value;
        return this.amount.map(fixed => {
            if (this._tagConfig.using.value) {
                const factor = this._tagConfig.value.value;
                if (factor !== 1) fixed *= factor;
            }
            // Limit at 15 decimals, as anything more causes issues with .toFixed
            if (Math.abs(fixed) < 1e-15) return '0';
            const original = fixed.toFixed(15);
            let [integers, decimals] = original.split('.');
            if (integers === '0' || integers === '-0') {
                let i = 0;
                while (i < decimals.length && decimals[i] === '0') i++;
                if (i === decimals.length) return '0';
                const toKeep = i + Math.min(2, significant);
                const rounded = String(this._round(decimals, toKeep));
                // If we rounded something like 0.999 we got 999, which rounded from 99.9 to 100
                const zeroes = rounded.length === toKeep - i ? i : i - 1;
                // In cases like 0.99 we have to round up to whole numbers
                if (zeroes < 0) return `1.${rounded.substr(1)}`;
                return `0.${'0'.repeat(zeroes)}${rounded}`;
            } else {
                const keep = fixed < 0 ? significant + 1 : significant;
                if (keep > integers.length) {
                    const toKeep = Math.min(2, keep - integers.length);
                    let rounded = String(this._round(decimals, toKeep));
                    // Handle decimal overflow into integers
                    if (rounded.length > toKeep) {
                       rounded = rounded.substr(1);
                       integers = String(Number(integers) + 1);
                    }
                    return rounded === '0' ? integers : `${integers}.${rounded}`;
                } else if (keep === integers.length)
                    return String(Math.round(Number(original)));
                else
                    return this._round(integers, keep) + '0'.repeat(integers.length - keep);
            }
        })
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
     * @returns {Promise<CurrencyAmount>}
     */
    async convertTo(tag) {
        tag = tag.toUpperCase();
        const rate = await this._converter.getRate(this.tag, tag);
        if (!rate) return null;
        const amount = this.amount.map(e => e * rate.rate);
        return new CurrencyAmount(tag, amount, this._services);
    }

    /**
     * @returns {[string]}
     */
    get displayValue() {
        const decimal = this._display.decimal.value;
        const thousands = this._display.thousands.value;
        return this.roundedAmount.map(roundedAmount => {
            const [integers, digits] = roundedAmount.split('.');
            const leftSide = integers.split(/(?=(?:.{3})*$)/).join(thousands);
            return leftSide + (digits ? (decimal + digits) : '')
        });
    }

    /**
     * @returns {string}
     */
    toString() {
        const value = this.displayValue.join(' - ');

        const usingCustom = this._tagConfig.using.value;
        if (!usingCustom) return `${value} ${this.tag}`;

        const customTag = this._tagConfig.display.value;
        return customTag.replace('¤', value);
    }
}