class CurrencyConverter {

    constructor() {
        this._baseCurrency = 'EUR';
        this.withBaseCurrency(null)
            .withConversionRatesBase(null)
            .withConversionRates(null)
            .withCustomTag(null);
    }

    /**
     * @param {CustomTag} customTag
     * @return {CurrencyConverter}
     */
    withCustomTag(customTag) {
        this._customTag = customTag;
        return this;
    }

    withBaseCurrency(baseCurrency) {
        this._baseCurrency = baseCurrency || 'EUR';
        return this;
    }

    get baseCurrency() {
        return this._baseCurrency;
    }

    withConversionRates(rates) {
        this._rates = rates;
        return this;
    }

    withConversionRatesBase(rates) {
        this._baseRate = rates;
        return this;
    }

    /**
     * @param {number} amount
     * @param {string} from
     * @return {number}
     */
    convert(amount, from) {
        from = from.toUpperCase();
        let result = this._convertWithoutCustomTag(amount, from);
        if (this._customTag && this._customTag.enabled)
            result /= this._customTag.value;
        return Utils.isSafeNumber(result) ? result : amount;
    }

    _convertWithoutCustomTag(amount, from) {
        if (from === this._baseCurrency)
            return amount;

        if (!this._rates || !this._rates[from])
            return amount;

        let result = amount / this._rates[from];

        if (this._baseCurrency !== this._baseRate)
            if (!this._rates[this._baseCurrency])
                return amount;
            else
                result *= this._rates[this._baseCurrency];
        return result;
    }

}