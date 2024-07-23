import {DisabledCurrenciesSetting} from "../../infrastructure/Configuration/setting";
import {Localizations} from "../Localization";
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
    private disabledConfig: DisabledCurrenciesSetting;

    private readonly currency: Node = {name: 'currency'}
    private readonly amount: Node = {name: 'currency'}
    private readonly whitespace: Node = {name: 'whitespace'}

    constructor({currencyTagConfig}: TextDetectorDep) {
        this.disabledConfig = currencyTagConfig.disabled;

        const disabled = this.disabledConfig.value
        const unique = Object.entries(Localizations.unique).filter(([key]) => !disabled.includes(key)).flatMap(([_, e]) => e)
        const shared = Object.keys(Localizations.shared)
        const symbols = Localizations.currencySymbols.filter(key => !disabled.includes(key))
        for (const word of [...unique, ...shared, ...symbols]) {
            let at = this.currency
            for (let i = 0; i < word.length; i++) {
                const char = word.charCodeAt(i)
                at[char] ??= {name: word[i]}
                at = at[char]
            }
            at.isEnd = true
        }

        const digits = '1234567890'.split('').map(e => e.charCodeAt(0))
        const whitespace = ' \t\n\r '.split('').map(e => e.charCodeAt(0))
        const groups = ',.'.split('').map(e => e.charCodeAt(0))
        const connect = (from: Node, edge: number[], to: Node) => edge.forEach(e => from[e] = to)

        connect(this.whitespace, whitespace, this.whitespace)

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
    }

    detect(text: string): boolean {
        return this.find(text).length > 0
    }

    find(text: string): FlatResult[] {
        const result: FlatResult[] = []
        let currency: ReturnType<typeof this.match>
        let amount: ReturnType<typeof this.match>
        for (let i = 0; i < text.length; i++) {
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

            } else continue

            const start = Math.min(currency.start, amount.start)
            const end = Math.max(currency.end, amount.end)
            result.push({
                startIndex: start,
                endIndex: end,
                currency: text.substring(currency.start, currency.end),
                amounts: text.substring(amount.start, amount.end).split('-').map(e => Number(e.replace(/[,\s]/g, ''))),
                currencyIndexes: {start: currency.start, end: currency.end},
                amountIndexes: {start: amount.start, end: amount.end}
            })
        }
        return result
    }

    private match(node: Node, text: string, i: number) {
        let at = node
        const start = i
        while (true) {
            const c = at[text.charCodeAt(i)]
            if (!c) break
            i++;
            at = c
        }
        const end = i
        return {match: at.isEnd, start, end}
    }
}