class CurrencyRate {
    /**
     * @param {string} from
     * @param {string} to
     * @param {number} rate
     * @param {Date} timestamp
     */
    constructor(from, to, rate, timestamp) {
        this.from = from;
        this.to = to;
        this.rate = rate;
        this.timestamp = timestamp;
    }

    /**
     * @returns {boolean}
     */
    get isExpired() {
        const now = Date.now();
        const stamp = this.timestamp.getTime();
        const diff = now - stamp;
        const day = 1000 * 60 * 60 * 24;
        return diff >= day;
    }
}