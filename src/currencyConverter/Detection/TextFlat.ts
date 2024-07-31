import {ActiveLocalization, Localizations} from "../Localization";
import {ActiveLocalizationDi} from "../Localization/ActiveLocalization";
import {BackendApiDiTypes} from "../BackendApi/BackendApi";
import {InfrastructureDiTypes} from "../../infrastructure";

type TextDetectorDep = ActiveLocalizationDi & BackendApiDiTypes & InfrastructureDiTypes

export type TextFlatDi = {
    textFlat: TextFlat
}

export type FlatResult = {
    startIndex: number
    endIndex: number
    currencyIndexes: { start: number, end: number }
    amountIndexes: { start: number, end: number }
    currency: string
    amounts: number[]
}

type Node = { [key: number]: Node } & { name: string, isEnd?: boolean }

export class TextFlat {
    private readonly currency: Node = {name: 'currency'}
    private readonly amount: Node = {name: 'currency'}
    private readonly whitespace: Node = {name: 'whitespace'}

    private activeLocalization: ActiveLocalization;

    constructor({activeLocalization}: TextDetectorDep) {
        this.activeLocalization = activeLocalization;
        const unique = Object.entries(Localizations.unique).flatMap(([_, e]) => e)
        const shared = Object.keys(Localizations.shared)
        const symbols = Localizations.currencySymbols
        for (const word of [...unique, ...shared, ...symbols]) {
            let at = this.currency
            for (let i = 0; i < word.length; i++) {
                const char = word.charCodeAt(i)
                at[char] ??= {name: word[i]}
                at = at[char]
            }
            at.isEnd = true
        }

        const zero = '0'.split('').map(e => e.charCodeAt(0))
        const nonZero = '123456789'.split('').map(e => e.charCodeAt(0))
        const dash = '-'.split('').map(e => e.charCodeAt(0))
        const digits = zero.concat(nonZero)
        const whitespace = ' \t\n\r '.split('').map(e => e.charCodeAt(0))
        const groups = ',.'.split('').map(e => e.charCodeAt(0))
        const connect = (from: Node, edge: number[], to: Node) => edge.forEach(e => from[e] = to)

        const createNode = (name: string, isEnd: boolean) => ({name, isEnd}) satisfies Node

        connect(this.whitespace, whitespace, this.whitespace)

        const secondRoot = createNode('second amount', false)
        connect(secondRoot, whitespace, secondRoot)
        createAmountStateMachine(secondRoot, (from, edge, to) => {
            const p = from[whitespace[0]] ? from[whitespace[0]] : createNode('whitespace', false)
            connect(from, whitespace, p)
            connect(p, whitespace, p)
            connect(from, edge, to)
            connect(p, edge, to)
        })
        createAmountStateMachine(this.amount, (from, edge, to) => {
            const p = from[whitespace[0]] ? from[whitespace[0]] : createNode('whitespace2', false)
            connect(from, whitespace, p);
            connect(from, edge, to)
            connect(p, whitespace, p);
            connect(p, edge, to)

            connect(from, dash, secondRoot)
            connect(p, dash, secondRoot)
        })


        function createAmountStateMachine(root: Node, connectWithWhitespace: (from: Node, edge: number[], to: Node) => void) {
            const lowInt = createNode('lowInt', true)
            connect(root, zero, lowInt)

            const lowDecimalPoint = createNode('lowDecimalPoint', false)
            connectWithWhitespace(lowInt, groups, lowDecimalPoint)

            const lowDecimal = createNode('lowDecimal', true)
            connectWithWhitespace(lowDecimalPoint, digits, lowDecimal)
            connect(lowDecimal, digits, lowDecimal)
            connectWithWhitespace(lowDecimal, [], createNode('ignored', false))

            const highFirst = createNode('highFirst', true)
            connect(root, nonZero, highFirst)
            const highSecond = createNode('highSecond', true)
            connect(highFirst, digits, highSecond)
            const highThird = createNode('highThird', true)
            connect(highSecond, digits, highThird)

            const highInf = createNode('highInf', true)
            connect(highThird, digits, highInf)
            connect(highInf, digits, highInf)

            const decimalPoint = createNode('decimalPoint', false)
            connectWithWhitespace(highInf, groups, decimalPoint)

            const highDecimals = createNode('highDecimals', true)
            connectWithWhitespace(decimalPoint, digits, highDecimals)
            const highDecimals2 = createNode('highDecimals2', true)
            connect(highDecimals, digits, highDecimals2)
            connectWithWhitespace(highDecimals2, [], createNode('ignored2', false))

            ;[
                [[groups[0]], [groups[1]]],
                [[groups[1]], [groups[0]]]
            ].forEach(([group, point]) => {
                const decimalPointOrGrouping = createNode('decimalPointOrGrouping', false)
                connectWithWhitespace(highFirst, group, decimalPointOrGrouping)
                connectWithWhitespace(highSecond, group, decimalPointOrGrouping)
                connectWithWhitespace(highThird, group, decimalPointOrGrouping)

                const maybeFirst = createNode('maybeFirst', true)
                connectWithWhitespace(decimalPointOrGrouping, digits, maybeFirst)
                const maybeSecond = createNode('maybeSecond', true)
                connect(maybeFirst, digits, maybeSecond)
                connectWithWhitespace(maybeSecond, [], createNode('lowInt', false))
                const maybeThird = createNode('maybeThird', true)
                connect(maybeSecond, digits, maybeThird)

                const grouping = createNode('grouping', false)
                connectWithWhitespace(maybeThird, group, grouping)

                const groupFirst = createNode('groupFirst', false)
                connectWithWhitespace(grouping, digits, groupFirst)
                const groupSecond = createNode('groupSecond', false)
                connect(groupFirst, digits, groupSecond)
                const groupThird = createNode('groupThird', true)
                connect(groupSecond, digits, groupThird)

                const decimalPoint = createNode('decimalPoint', false)
                connectWithWhitespace(groupThird, point, decimalPoint)
                connectWithWhitespace(maybeThird, point, decimalPoint)
                connectWithWhitespace(decimalPoint, digits, highDecimals)
            })
        }


        /*
        const integer: Node = {name: 'integer', isEnd: true}
        connect(this.amount, digits, integer)
        connect(integer, digits, integer)

        const prePoint: Node = {name: 'prePoint', isEnd: true}
        connect(integer, whitespace, prePoint)
        connect(prePoint, whitespace, prePoint)

        const decimalPoint: Node = {name: 'decimalPoint', isEnd: true}
        connect(integer, groups, decimalPoint)
        connect(prePoint, groups, decimalPoint)

        const postPoint: Node = {name: 'postPoint', isEnd: true}
        connect(decimalPoint, whitespace, postPoint)
        connect(postPoint, whitespace, postPoint)

        const decimal: Node = {name: 'decimal', isEnd: true}
        connect(decimalPoint, digits, decimal)
        connect(postPoint, digits, decimal)
        connect(decimal, digits, decimal)
         */
    }

    detect(text: string): boolean {
        return this.find(text).length > 0
    }

    find(text: string): FlatResult[] {
        const result: FlatResult[] = []
        let currency: ReturnType<typeof this.match>
        let amount: ReturnType<typeof this.match>
        for (let i = 0; i < text.length;) {
            const char = text.charCodeAt(i)

            if (this.currency[char]) {

                currency = this.match(this.currency, text, i)
                i = currency.end
                if (!currency.match) continue

                i = this.match(this.whitespace, text, i).end

                if (!this.amount[text.charCodeAt(i)]) continue
                amount = this.match(this.amount, text, i)
                i = amount.end
                if (!amount.match) continue

            } else if (this.amount[char]) {

                amount = this.match(this.amount, text, i)
                i = amount.end
                if (!amount.match) continue

                i = this.match(this.whitespace, text, i).end

                if (!this.currency[text.charCodeAt(i)]) continue
                currency = this.match(this.currency, text, i)
                i = currency.end
                if (!currency.match) continue

            } else {
                i++
                continue
            }

            const start = Math.min(currency.start, amount.start)
            const end = Math.max(currency.end, amount.end)
            const realCurrency = this.activeLocalization.parseCurrency(text.substring(currency.start, currency.end))
            if (realCurrency === null) continue
            result.push({
                startIndex: start,
                endIndex: end,
                currency: realCurrency,
                amounts: text.substring(amount.start, amount.end).split('-')
                    .map(e => e.replace(/\s/g, ''))
                    .map(e => e.replace(/,/g, '.'))
                    .map(e => {
                        if (e.charAt(0) === '0') return +e
                        const lastDot = e.lastIndexOf('.')
                        if (lastDot === -1) return +e
                        if (lastDot !== e.length - 3) return +e.replace(/\./g, '')
                        return +(e.substring(0, lastDot).replace(/\./g, '') + '.' + e.substring(lastDot + 1))
                    }),
                currencyIndexes: {start: currency.start, end: currency.end},
                amountIndexes: {start: amount.start, end: amount.end}
            })
        }
        return result
    }

    private match(node: Node, text: string, i: number) {
        let at = node
        const start = i
        let end = -1
        while (true) {
            const c = at[text.charCodeAt(i)]
            if (!c) break
            i++;
            at = c
            if (at.isEnd) end = i
        }
        return {match: end !== -1, start, end: end === -1 ? i : end}
    }
}