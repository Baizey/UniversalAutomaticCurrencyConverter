class SiteSpecificSettings {

    /**
     * @param rawSettings
     * @returns {undefined|SiteSpecificSettings}
     */
    static createFrom(rawSettings) {
        if (!rawSettings)
            return undefined;
        return new SiteSpecificSettings(rawSettings.localization);
    }

    /**
     * @params {{dollar: string, krone: string, asian: string}} localization
     */
    constructor(localization) {
        this.localization = localization;
    }

    /**
     * @params {{dollar: string, krone: string, asian: string}} localization
     */
    setLocalization(localization) {
        this.localization = localization;
    }

    get forStorage() {
        return {
            localization: this.localization
        }
    }

}