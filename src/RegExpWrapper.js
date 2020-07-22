class RegularExpression {

    static create(regex, flags, isFirefox) {
        if (!isFirefox) return new RegExp(regex, flags);
        return new RegularExpression(regex, flags);
    }

    /**
     * @param {string} regex
     * @param {string} flags
     * @private
     */
    constructor(regex, flags) {
        this.lastIndex = 0;
        this.runner = XRegExp.cache(regex, flags);
    }

    get source() {
        return this.runner.source;
    }

    /**
     * @param {string} text
     * @returns {boolean}
     */
    test(text) {
        return this.runner.test(text);
    }

    /**
     * @param {string} text
     * @returns {RegExpExecArray}
     */
    exec(text) {
        const result = XRegExp.exec(text, this.runner, this.lastIndex)

        if (result) {
            result.groups = result;
            this.lastIndex = result.index + result[0].length;
        } else this.lastIndex = text.length;

        return result;
    }

}