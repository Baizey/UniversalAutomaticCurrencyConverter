class Timer {
    /**
     * @param {number} now
     */
    constructor(now = undefined) {
        this.setStart(now);
    }

    /**
     * @returns {Timer}
     */
    reset() {
        this._start = Date.now();
        return this;
    }

    /**
     * @param {number} now
     * @returns {Timer}
     */
    setStart(now = undefined) {
        this._start = now || Date.now();
        return this;
    }

    /**
     * @returns {number}
     */
    get timePassed() {
        const now = Date.now();
        const diff = now - this._start;
        // Convert to seconds
        return diff / 1000;
    }

    /**
     * @param prefix
     * @returns {Timer}
     */
    log(prefix = 'Time passed') {
        const time = this.timePassed;
        console.log(`UACC: ${prefix} took ${time.toFixed(3)} seconds`)
        return this;
    }
}