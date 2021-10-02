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
    decimalPointLeft: string | undefined
    decimalLeft: string | undefined

    range_inner: string | undefined

    amountRight: string | undefined

    full_integerRight: string | undefined
    negRight: string | undefined
    integerRight: string | undefined

    full_decimalRight: string | undefined
    decimalPointRight: string | undefined
    decimalRight: string | undefined

    whitespaceRight: string | undefined
    currencyRight: string | undefined
    end: string | undefined
}

function mapToGroups(result: RegExpExecArray): RegexGroups {
    const [, start, currencyLeft, whitespaceLeft, full_range, amountLeft, full_integerLeft, negLeft, integerLeft, full_decimalLeft, decimalPointLeft, decimalLeft, range_inner, amountRight, full_integerRight, negRight, integerRight, full_decimalRight, decimalPointRight, decimalRight, whitespaceRight, currencyRight, end] = result;
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

    private static currencyRegex() {
        // noinspection JSMismatchedCollectionQueryUpdate
        const empty: string[] = [],
            symbols: string = empty
                .concat(Object.values(Localizations.unique)
                    .reduce((a, b) => [...a, ...b])
                    .map(e => e.replace(/\$/g, '\\$')))
                .concat(Object.keys(Localizations.shared)
                    .map(e => e.replace(/\$/g, '\\$')))
                .concat([/[A-Z]{3}/.source])
                .join('|');
        return `(${symbols})?`;
    }

    private static integerRegex() {
        // Regex for parts
        const neg = /[-]?/.source
        const integer = /\d{1,3}?(?:[., ]\d{3})*|\d{4,}/.source

        // Group naming for catching
        const negGroup = `(${neg})`
        const integerGroup = `(${integer})`;

        // Final collection
        return `(${negGroup}${integerGroup})`;
    }

    private static decimalRegex() {
        // Regex for parts
        const decimalPoint = /[,.]/.source
        const decimal = /\d+|-{2}/.source

        // Group naming for catching
        const decimalPointGroup = `(${decimalPoint})`;
        const decimalGroup = `(${decimal})`;

        // Final collection
        return `(\\s*${decimalPointGroup}\\s*${decimalGroup})?`;
    }

    private static amountRegex() {
        return `(${CurrencyRegex.integerRegex()}${CurrencyRegex.decimalRegex()})`;
    }

    private static rangeAmountRegex() {
        const innerRange = /\s*-\s*/.source
        const innerRangeGroup = `(${innerRange})`
        const range = `(?:${innerRangeGroup}${CurrencyRegex.amountRegex()})?`;
        return `(${CurrencyRegex.amountRegex()}${range})`;
    }

    private static constructRegex(): string {
        const s = /["‎+:|`^'& ,.<>()\\/\s*]/.source;
        const start = `(^|${s})`;
        const e = /["‎+:|`^'& ,.<>()\\/\s*\-]/.source;
        const end = `($|${e})`;

        const whitespace = /\s*/.source;
        return [
            start,
            CurrencyRegex.currencyRegex(),
            `(${whitespace})`,
            CurrencyRegex.rangeAmountRegex(),
            `(${whitespace})`,
            CurrencyRegex.currencyRegex(),
            end,
        ].join('');

    }

    test(): boolean {
        const oldIndex = this.regex.lastIndex;
        const result = this.regex.test(this.text);
        this.regex.lastIndex = oldIndex;
        return result;
    }

    next(): null | RegexResult {
        const regexResult = this.regex.exec(this.text);
        if(!regexResult) return null;
        // Allows us to reuse a start/end symbol to catch currency close together like '5$ 5$'
        if(regexResult[0].length > 1) this.regex.lastIndex--;

        const group = mapToGroups(regexResult)

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
            integer: (group.integerLeft || '').replace(/[^\d]+/gm, ''),
            decimal: (group.decimalLeft || '').replace(/[^\d]+/gm, '')
        }]
        if(group.integerRight)
            amounts.push({
                neg: group.negRight || '+',
                integer: (group.integerRight || '').replace(/[^\d]+/gm, ''),
                decimal: (group.decimalRight || '').replace(/[^\d]+/gm, '')
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