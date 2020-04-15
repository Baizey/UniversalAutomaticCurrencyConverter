let _engineInstance;

class Engine {
    /**
     * @returns {Engine}
     */
    static get instance() {
        if (!_engineInstance) _engineInstance = new Engine();
        return _engineInstance;
    }

    /**
     * @param {{allowance: SiteAllowance, detector: Detector, config: Configuration, activeLocalization: ActiveLocalization}} services
     */
    constructor(services = {}) {
        this._allowance = services.allowance || SiteAllowance.instance;
        this._detector = services.detector || Detector.instance;
        this._config = services.config || Configuration.instance;
        this._activeLocalization = services.activeLocalization || ActiveLocalization.instance;
    }

    /**
     * @returns {Promise<void>}
     */
    async load() {
        const timer = new Timer();
        await Promise.all([this._config.load(), this._detector.updateSymbols()]);
        timer.log('Loaded settings and symbols...').reset();
        await this._activeLocalization.load();
        await this._activeLocalization.determineForSite();
        this._detector.updateSharedLocalizations();
        timer.log('Determined localization...').reset();
        this._allowance.updateFromConfig();
        timer.log('Pre-processed white/black listing...').reset();
    }

    /**
     * @returns {Promise<void>}
     * @private
     */
    async _loadSiteLocalization() {
        const canShowAlert = this._config.alert.localization.value;
        if (canShowAlert && await this._activeLocalization.hasConflict()) {
            // TODO: show alert
        }
    }

}