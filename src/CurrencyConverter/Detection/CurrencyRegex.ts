import {Localizations} from "../Localization";

type RegexGroups = {
    start: string | undefined
    currencyLeft: string | undefined
    whitespaceLeft: string | undefined

    full_range: string

    amountLeft: string

    full_integerLeft: string
    negLeft: string | undefined
    integerLeft: string

    full_decimalLeft: string | undefined
    decimalLeft: string | undefined
    decimalPointLeft: string | undefined

    range_inner: string | undefined

    amountRight: string | undefined

    full_integerRight: string | undefined
    negRight: string | undefined
    integerRight: string | undefined

    full_decimalRight: string | undefined
    decimalRight: string | undefined
    decimalPointRight: string | undefined

    whitespaceRight: string | undefined
    currencyRight: string | undefined
    end: string | undefined
}

function mapToGroups(result: RegExpExecArray): RegexGroups {
    const [all, start, currencyLeft, whitespaceLeft, full_range, amountLeft, full_integerLeft, negLeft, integerLeft, full_decimalLeft, decimalLeft, decimalPointLeft, range_inner, amountRight, full_integerRight, negRight, integerRight, full_decimalRight, decimalRight, decimalPointRight, whitespaceRight, currencyRight, end] = result;
    return {
        start,
        currencyLeft,
        whitespaceLeft,
        full_range,
        amountLeft,
        full_integerLeft,
        negLeft,
        integerLeft,
        full_decimalLeft,
        decimalLeft,
        decimalPointLeft,
        range_inner,
        amountRight,
        full_integerRight,
        negRight,
        integerRight,
        full_decimalRight,
        decimalRight,
        decimalPointRight,
        whitespaceRight,
        currencyRight,
        end,
    }
}

export type RegexResult = {
    startIndex: number
    length: number
    indexes: [number, number, number, number, number, number]
    text: string
    currencies: string[]
    amounts: { neg: string, integer: string, decimal: string }[]
}

export class CurrencyRegex {
    readonly text: string;
    private regex: RegExp;

    constructor(text: string) {
        this.text = text;
        this.regex = new RegExp(CurrencyRegex.constructRegex(), 'gm')
    }

    private static currencyRegex(key: string) {
        const empty: string[] = [],
            symbols: string = empty
                .concat(Object.values(Localizations.unique)
                    .reduce((a, b) => [...a, ...b])
                    .map(e => e.replace('$', '\\$')))
                .concat(Object.keys(Localizations.shared)
                    .map(e => e.replace('$', '\\$')))
                .concat([/[A-Z]{3}/.source])
                .join('|');
        return `(${symbols})?`;
    }

    private static integerRegex(key: string) {
        // Regex for parts
        const neg = /[-]?/.source
        const integer = /(?:(?:\d{1,3}?(?:[., ]\d{3})*)|\d{4,})/.source

        // Group naming for catching
        const negGroup = `(${neg})`
        const integerGroup = `(${integer})`;

        // Final collection
        return `(${negGroup}${integerGroup})`;
    }

    private static decimalRegex(key: string) {
        // Regex for parts
        const decimalPoint = /[,.]/.source
        const decimal = /\d+|-{2}/.source

        // Group naming for catching
        const decimalPointGroup = `(${decimalPoint})`;
        const decimalGroup = `(${decimal})`;

        // Final collection
        return `(\\s*${decimalPointGroup}\\s*${decimalGroup})?`;
    }

    private static amountRegex(key: string) {
        return `(${CurrencyRegex.integerRegex(key)}${CurrencyRegex.decimalRegex(key)})`;
    }

    private static rangeAmountRegex() {
        const innerRange = /\s*-\s*/.source
        const innerRangeGroup = `(${innerRange})`
        const range = `(?:${innerRangeGroup}${CurrencyRegex.amountRegex('Right')})?`;
        return `(${CurrencyRegex.amountRegex('Left')}${range})`;
    }

    private static constructRegex(): string {
        const s = /["‎+:|\`^'& ,.<>()\\/\s*]/.source;
        const start = `(^|${s})`;
        const e = /["‎+:|\`^'& ,.<>()\\/\s*\-]/.source;
        const end = `($|${e})`;

        const whitespace = /\s*/.source;
        return [
            start,
            CurrencyRegex.currencyRegex('Left'),
            `(${whitespace})`,
            CurrencyRegex.rangeAmountRegex(),
            `(${whitespace})`,
            CurrencyRegex.currencyRegex('Right'),
            end,
        ].join('');

    }

    test(): boolean {
        return this.regex.test(this.text);
    }

    next(): null | RegexResult {
        const regexResult = this.regex.exec(this.text);
        if(!regexResult) return null;
        // Allows us to reuse a start/end symbol to catch currency close together like '5$ 5$'
        if(regexResult[0].length > 1) this.regex.lastIndex--;

        // Firefox doesnt have a groups object, but rather has it on the result itself
        if(!regexResult.groups) // @ts-ignore
            regexResult.groups = regexResult;

        const group = regexResult.groups as RegexGroups;

        const leftOuter = [
            group.start
        ].map(e => (e || '').length)
            .reduce((a, b) => a + b) + regexResult.index
        const leftInner = [
            group.currencyLeft,
            group.whitespaceLeft
        ].map(e => (e || '').length)
            .reduce((a, b) => a + b) + leftOuter
        const leftAmount = [
            group.negLeft
        ].map(e => (e || '').length)
            .reduce((a, b) => a + b) + leftInner
        const rightAmount = 1 + leftAmount
        const rightInner = [
            group.integerLeft,
            group.full_decimalLeft,
            group.range_inner,
            group.amountRight,
        ].map(e => (e || '').length)
            .reduce((a, b) => a + b) + leftAmount
        const rightOuter = [
            group.whitespaceRight,
            group.currencyRight
        ].map(e => (e || '').length)
            .reduce((a, b) => a + b) + rightInner

        const amounts = [{
            neg: group.negLeft || '+',
            integer: group.integerLeft || '',
            decimal: group.decimalLeft || ''
        }]
        if(group.integerRight)
            amounts.push({
                neg: group.negRight || '+',
                integer: group.integerRight || '',
                decimal: group.decimalRight || ''
            })

        return {
            startIndex: regexResult.index,
            length: regexResult[0].length,
            indexes: [leftOuter, leftInner, leftAmount, rightAmount, rightInner, rightOuter],
            text: regexResult[0],
            currencies: [group.currencyLeft || '', group.currencyRight || ''],
            amounts: amounts
        } as RegexResult
    }
}