/**
 * @param {string} int
 * @param {string} dec
 * @param {number} point
 * @return {[string, string]}
 */
const roundAtPoint = (int, dec, point = 0) => {
    // If we just need to round the current number
    if (point === 0) {
        const forgottenZeros = int.charAt(0) === '0' ? int.split(/[1-9]/, 1)[0] : '';
        return [forgottenZeros + Math.round(int + '.' + dec) + '', ''];
    }
    // If we need to round in 10's or higher
    if (point < 0) {
        const newPoint = int.length + point;
        const [newInt] = roundAtPoint(int.substr(0, newPoint), int.substr(newPoint));
        return [newInt + '0'.repeat(-point), ''];
    }
    // If we need to round in decimals
    if (dec.length < point)
        dec += '0'.repeat(point - dec.length);
    const [newInt] = roundAtPoint(int + dec.substr(0, point), dec.substr(point));
    return [newInt.substr(0, newInt.length - point), newInt.substr(newInt.length - point)];
};

class NumberFormatter {
    constructor(decimal, thousand, rounding) {
        this.withDecimal(decimal).withThousand(thousand).withRounding(rounding);
    }

    withRounding(rounding) {
        this._rounding = (Utils.isUndefined(rounding) || !Utils.isSafeNumber(rounding) || rounding < 1)
            ? 2
            : rounding;
        return this;
    }

    withDecimal(decimal) {
        this._decimal = ',.'.indexOf(decimal) >= 0
            ? decimal
            : '.';
        return this;
    }

    withThousand(thousand) {
        this._thousand = ',. '.indexOf(thousand) >= 0 || thousand === ''
            ? thousand
            : ' ';
        return this;
    }

    get thousand() {
        return this._thousand;
    }

    get decimal() {
        return this._decimal;
    }

    get rounding() {
        return this._rounding;
    }

    /**
     * @param {number} number
     * @return {string}
     */
    format(number) {
        let [int, dec] = (number + '').split('.');
        int = int.replace(/[ ,.]/g, '').split(/(?=(?:.{3})*$)/).join(this._thousand);
        return dec
            ? `${int}${this._decimal}${dec}`
            : int;
    }

    /**
     * Rounds to this._rounding from most significant digit
     * Moving decimal by strings as to avoid floaty errors
     * @param {number}  value
     * @return {number}
     */
    round(value) {
        // Small numbers are ignored as they turn into scientific notation and are kinda redundant for currencies
        if (Math.abs(value) < .000001) return 0;

        const neg = value < 0;
        value = Math.abs(value);
        const str = (value + '');

        let [int, dec] = str.split('.');
        dec = dec ? dec : '';

        let point = int === '0'
            ? Math.min(2, this._rounding) + dec.search(/[1-9]/)
            : Math.min(2, -int.length + this._rounding);

        let [newInt, newDec] = roundAtPoint(int, dec, point);

        const result = Number(newInt + '.' + newDec);

        return neg ? -result : result;
    }
}