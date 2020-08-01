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
        const match = XRegExp.exec(text, this.runner, this.lastIndex)

        if (match) {
            match.groups = match;
            this.lastIndex = match.index + match[0].length;
        } else this.lastIndex = text.length;

        return match;
    }

}