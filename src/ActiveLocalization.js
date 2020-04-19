let _activeLocalizationInstance;

class ActiveLocalization {

    /***
     * @returns {ActiveLocalization}
     */
    static get instance() {
        if (!_activeLocalizationInstance) _activeLocalizationInstance = new ActiveLocalization();
        return _activeLocalizationInstance;
    }

    /**
     * @param {{config: Configuration, browser: Browser}} services
     */
    constructor(services = {}) {
        this._browser = services.browser || Browser.instance;
        this._localization = (services.config || Configuration.instance).localization;
        this.krone = null;
        this.yen = null;
        this.dollar = null;
        this._kroneKey = `uacc:site:localization:krone:${this._browser.hostname}`;
        this._yenKey = `uacc:site:localization:yen:${this._browser.hostname}`;
        this._dollarKey = `uacc:site:localization:dollar:${this._browser.hostname}`;
        this._lockedKey = `uacc:site:localization:locked:${this._browser.hostname}`;
        this._defaultKrone = null;
        this._defaultYen = null;
        this._defaultDollar = null;
    }

    /**
     * @returns {{yen: string, krone: string, dollar: string}}
     */
    get compact() {
        return {
            dollar: this.dollar,
            yen: this.yen,
            krone: this.krone
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async load() {
        const result = await this._browser.loadLocal([this._kroneKey, this._yenKey, this._dollarKey]);

        // Use site specific localization first, if not found use global localization preference
        this.krone = result[this._kroneKey] || this._localization.krone.value;
        this.yen = result[this._yenKey] || this._localization.asian.value;
        this.dollar = result[this._dollarKey] || this._localization.dollar.value;

        this._defaultKrone = this.krone;
        this._defaultYen = this.yen;
        this._defaultDollar = this.dollar;
    }

    /**
     * @param {{krone: string, yen: string, dollar: string}} input
     * @returns {Promise<void>}
     */
    async overload(input) {
        if (!input) return;
        if (input.krone && /^[A-Z]{3}$/.test(input.krone))
            this.krone = input.krone || this.krone;
        if (input.yen && /^[A-Z]{3}$/.test(input.yen))
            this.yen = input.yen || this.yen;
        if (input.dollar && /^[A-Z]{3}$/.test(input.dollar))
            this.dollar = input.dollar || this.dollar;
        await this.lockSite(false);
    }

    /**
     * @returns {Promise<void>}
     */
    async save() {
        await this._browser.saveLocal({
            [this._kroneKey]: this.krone,
            [this._yenKey]: this.yen,
            [this._dollarKey]: this.dollar,
        }, null);
    }

    /**
     * @returns {boolean}
     */
    async hasConflict() {
        if (this.krone === this._defaultKrone && this.dollar === this._defaultDollar && this.yen === this._defaultYen)
            return false;
        return !(await this.isLocked());
    }

    /**
     * @returns {Promise<boolean>}
     */
    async isLocked() {
        return !!(await this._browser.loadLocal([this._lockedKey]))[this._lockedKey];
    }

    /**
     * @param {boolean} bool
     * @returns {Promise<void>}
     */
    async lockSite(bool) {
        await this._browser.saveLocal(this._lockedKey, !!bool);
    }

    /**
     * @param {string} text
     * @returns {Promise<void>}
     */
    async determineForSite(text) {
        // If the user has locked localization for site, do nothing
        if (await this.isLocked()) return;
        const shared = Localizations.shared;
        this.yen = this._determine(this.yen, text, shared['¥']);
        this.dollar = this._determine(this.dollar, text, shared['$']);
        this.krone = this._determine(this.krone, text, shared['kr']);
    }

    /**
     * @param {string} currentTag
     * @param {string} text
     * @param {[string]} tags
     * @returns {string}
     * @private
     */
    _determine(currentTag, text, tags) {
        const host = this._browser.host;
        const hostCurrency = Localizations.hostCurrency[host];
        // Add 1 to counter if host is same as currency and add 1 if current default is same
        tags = tags.map(t => ({tag: t, count: (hostCurrency === t) + (currentTag === t)}));
        tags.forEach(tag => {
            const re = new RegExp('(^\\W_)' + tag + '($\\W_)', 'g')
            tag.count += ((text || '').match(re) || []).length
        });
        return tags.reduce((p, n) => p.count > n.count ? p : n).tag
    }

}