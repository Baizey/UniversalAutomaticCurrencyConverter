class SiteLocalization {
    /**
     * @param rawSettings
     */
    fillFrom(rawSettings) {
        if (!rawSettings) return;
        this.setLocalization(rawSettings.localization);
        this.setOverrideable(rawSettings.isOverrideable);
    }

    constructor() {
        this._localization = {
            dollar: 'USD',
            krone: 'SEK',
            asian: 'CNY'
        };
        this.symbols = {
            dollar: '$',
            krone: 'kr',
            asian: '¥'
        };
        this.isOverrideable = true;
    }

    get dollar() {
        return this._localization.dollar;
    }

    get asian() {
        return this._localization.asian;
    }

    get krone() {
        return this._localization.krone;
    }

    /**
     * @param {string} currency
     */
    setDefaultLocalization(currency) {
        if (Utils.isUndefined(currency)) return;
        switch (currency) {
            case 'USD':
            case 'CAD':
            case 'AUD':
            case 'MXN':
            case 'NZD':
            case 'SGP':
            case 'HKD':
                this._localization.dollar = currency;
                break;
            case 'SEK':
            case 'DKK':
            case 'NOK':
            case 'ISK':
            case 'CZK':
                this._localization.krone = currency;
                break;
            case 'CNY':
            case 'JPY':
                this._localization.asian = currency;
                break;
        }
    }

    /**
     * @params {boolean} overrideable
     */
    setOverrideable(overrideable) {
        if (Utils.isUndefined(overrideable))
            return;
        if (typeof overrideable === "string")
            this.isOverrideable = overrideable.toLowerCase() === 'true';
        else
            this.isOverrideable = !!overrideable;
    }

    /**
     * @params {{dollar: string, krone: string, asian: string}} localization
     */
    setLocalization(localization) {
        if (Utils.isUndefined(localization))
            return;
        Object.keys(localization)
            .forEach(key => this.setDefaultLocalization(localization[key]));
    }

    /**
     * @returns {{localization: ({dollar: string, krone: string, asian: string}), isOverrideable: (boolean}}
     */
    get forStorage() {
        return {
            localization: this._localization,
            isOverrideable: this.isOverrideable
        }
    }

    get forLookup() {
        const obj = {};
        obj[this._localization.dollar] = true;
        obj[this._localization.asian] = true;
        obj[this._localization.krone] = true;
        return obj;
    }

}