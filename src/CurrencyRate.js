class CurrencyRate {
    /**
     * @param {string} from
     * @param {string} to
     * @param {number} rate
     * @param {number} timestamp
     */
    constructor(from, to, rate, timestamp) {
        this.from = from;
        this.to = to;
        this.rate = rate;
        this.timestamp = new Date(timestamp);
    }

    /**
     * @returns {boolean}
     */
    get isExpired() {
        const now = Date.now();
        const stamp = this.timestamp.getTime();
        if (isNaN(stamp)) return true;
        const diff = now - stamp;
        const day = 1000 * 60 * 60 * 24;
        return diff >= day;
    }
}