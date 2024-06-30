import {ActiveLocalization, Localizations} from "../Localization";
import {BackendApi, BackendApiDiTypes} from "../BackendApi/BackendApi";
import {ActiveLocalizationDi} from "../Localization/ActiveLocalization";


export type MagicDetectorDi = {
    magicDetector: MagicDetector
}

type MagicDetectorDiTypes = BackendApiDiTypes & ActiveLocalizationDi

const whitespaces = toChars(" \t\n\r\u00A0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u200B\u202F\u205F\u3000")

type DetectionResult = {
    startIndex: number,
    endIndex: number
    text: string
    currency: string,
    amounts: [number]
}

export class MagicDetector {
    private readonly backendApi: BackendApi
    private readonly activeLocalization: ActiveLocalization;

    private stateMachine: Node = createNode()
    private symbolRoot: Node = createNode()
    private numberRoot: Node = createNode()

    constructor({backendApi, activeLocalization}: MagicDetectorDiTypes) {
        this.backendApi = backendApi;
        this.activeLocalization = activeLocalization;
        this.stateMachine = createNode()
        this.symbolRoot = this.stateMachine
        this.numberRoot = this.stateMachine
    }

    async load() {
        const uniqueSymbols = Object.keys(Localizations.uniqueSymbols).map(toChars)
        const rawSymbols = await this.backendApi.symbols() ?? {}
        const symbols = Object.keys(rawSymbols).map(toChars)
        const allSymbols = uniqueSymbols.concat(symbols)
        const root = createNode()
        this.stateMachine = root
        const symbolEnds = createTrie(allSymbols, root)
        symbolEnds.forEach(end => whitespaces.forEach(c => connectEdge(end, c, end)))
        symbolEnds.forEach(end => end.isLegalEnd = false)
        const endNumberRoot = createNode()
        this.numberRoot = endNumberRoot
        createNumberTrie(endNumberRoot)
        Object.keys(endNumberRoot)
            .filter(e => endNumberRoot[e])
            .forEach(c => symbolEnds.forEach(s => connectEdge(s, Number(c), endNumberRoot[c])))

        const numberEnds = createNumberTrie(root)
        numberEnds.forEach(end => whitespaces.forEach(c => connectEdge(end, c, end)))
        numberEnds.forEach(end => end.isLegalEnd = false)
        const endSymbolRoot = createNode()
        this.symbolRoot = endSymbolRoot
        createTrie(allSymbols, endSymbolRoot)
        Object.keys(endSymbolRoot)
            .filter(e => endSymbolRoot[e])
            .forEach(c => numberEnds.forEach(s => connectEdge(s, Number(c), endSymbolRoot[c])))
    }

    detect(text: string): boolean {
        const rootState = this.stateMachine
        const n = text.length
        for (let i = 0; i < n; i++) {
            let state = rootState[text.codePointAt(i)!]!
            if (state === undefined) continue
            i++
            while (true) {
                const nextState = state[text.codePointAt(i)!]
                if (nextState == undefined) break
                i++
                state = nextState
            }
            i--
            if (state.isLegalEnd) return true
        }
        return false
    }

    find(text: string): DetectionResult[] {
        const rootState = this.stateMachine
        const n = text.length
        const results: DetectionResult[] = []
        for (let i = 0; i < n; i++) {
            let state = rootState[text.codePointAt(i)!]!
            if (state === undefined) continue
            const start = i
            i++
            while (true) {
                const next = state[text.codePointAt(i)!]
                if (next == undefined) break
                i++
                state = next
            }
            const end = i
            i--
            if (state.isLegalEnd) {
                results.push(this.mapToResult(text.substring(start, end), start, end))
            }
        }
        return results
    }

    private mapToResult(text: string, startIndex: number, endIndex: number): DetectionResult {
        const currencyIndexes = '' //this.subFind(text, this.symbolRoot)[0]
        const currency = this.activeLocalization.parseCurrency('$')!
        return {text, startIndex, endIndex, currency, amounts: [0]}

        const numberIndexes = this.subFind(text, this.numberRoot)[0]

        const rawNumber = text.substring(numberIndexes.start, numberIndexes.end).replace(/\s/g, '')
        let amount = 0

        const neg = rawNumber[0] === '-' ? '-' : ''
        const comma = rawNumber.lastIndexOf(',')
        const dot = rawNumber.lastIndexOf('.')
        const split = Math.max(comma, dot)
        if (comma !== -1 && dot !== -1) {
            const integer = rawNumber.substring(0, split)
            const decimal = rawNumber.substring(split + 1).replace(/[^0-9]/g, '')
            amount = Number(`${neg}${integer}.${decimal}`)
        } else if (comma !== -1 || dot !== -1) {
            const integer = rawNumber.substring(0, split)
            const decimal = rawNumber.substring(split + 1)
            if (decimal.length == 2) {
                amount = Number(`${neg}${integer.replace(/[^0-9]/g, '')}.${decimal}`)
            }
        } else {
            amount = Number(`${neg}${rawNumber.replace(/[^0-9]/g, '')}`)
        }

        return {
            startIndex,
            endIndex,
            text,
            currency,
            amounts: [amount]
        } satisfies DetectionResult
    }

    private subFind(text: string, rootState: Node): { start: number, end: number }[] {
        const n = text.length
        const results: { start: number, end: number }[] = []
        for (let i = 0; i < n; i++) {
            let state = rootState[text.codePointAt(i)!]!
            if (state === undefined) continue
            const start = i
            i++
            while (true) {
                const next = state[text.codePointAt(i)!]
                if (next == undefined) break
                i++
                state = next
            }
            const end = i
            i--
            if (state.isLegalEnd) {
                results.push(({start, end}))
            }
        }
        return results
    }
}


function toChars(text: string): number[] {
    const split = text.split('')
    const n = split.length
    const arr: number[] = new Array(n)
    for (let i = 0; i < n; i++) arr[i] = split[i].codePointAt(0)!
    return arr
}

function createNumberTrie(root: Node): Node[] {
    const ends: Node[] = []
    const digits = toChars("0123456789")

    function create(isEnd: boolean) {
        const node = createNode()
        node.isLegalEnd = isEnd
        if (isEnd) ends.push(node)
        return node
    }

    const neg = toChars('-')[0]
    const split = [toChars('.,'), toChars(',.')]

    const negation = create(false)

    const zero = create(true)
    const firstInt = create(true)
    const secondInt = create(true)
    const thirdInt = create(true)
    const integer = create(true)

    const zeroDecimal = create(true)
    const firstDecimal = create(true)
    const secondDecimal = create(true)
    const trailingDecimals = create(true)

    whitespaces.forEach(c => {
        connectEdge(negation, c, negation)
        connectEdge(zero, c, zero)
        connectEdge(firstInt, c, firstInt)
        connectEdge(secondInt, c, secondInt)
        connectEdge(thirdInt, c, thirdInt)
        connectEdge(integer, c, integer)
    })

    connectEdge(root, digits[0], zero)
    connectEdge(negation, digits[0], zero)
    connectEdge(root, neg, negation)
    digits.slice(1).forEach(c => {
        connectEdge(root, c, firstInt)
        connectEdge(negation, c, firstInt)
    })

    digits.forEach(c => {
        connectEdge(firstInt, c, secondInt)
        connectEdge(secondInt, c, thirdInt)
        connectEdge(thirdInt, c, integer)
        connectEdge(integer, c, integer)
    })

    split.forEach(([first, second]) => {
        const groupOrDecimal = create(true)
        const group = create(true)
        const firstGroup = create(true)
        const secondGroup = create(true)
        const thirdGroup = create(true)

        whitespaces.forEach(c => {
            connectEdge(groupOrDecimal, c, groupOrDecimal)
            connectEdge(group, c, group)
            connectEdge(thirdGroup, c, thirdGroup)
        })

        connectEdge(firstInt, first, groupOrDecimal)
        connectEdge(secondInt, first, groupOrDecimal)
        connectEdge(thirdInt, first, groupOrDecimal)
        connectEdge(integer, first, zeroDecimal)
        connectEdge(zero, first, trailingDecimals)

        digits.forEach(c => {
            connectEdge(group, c, firstGroup)
            connectEdge(groupOrDecimal, c, firstGroup)
            connectEdge(firstGroup, c, secondGroup)
            connectEdge(secondGroup, c, thirdGroup)
        })
        connectEdge(thirdGroup, first, group)
        connectEdge(thirdGroup, second, zeroDecimal)
    })

    digits.forEach(c => {
        connectEdge(zeroDecimal, c, firstDecimal)
        connectEdge(firstDecimal, c, secondDecimal)
        connectEdge(trailingDecimals, c, trailingDecimals)
    })

    return ends
}

function createTrie(values: number[][], root: Node): Node[] {
    const ends: Node[] = []
    values.forEach(word => {
        let at = root
        word.forEach(c => at = getOrCreateEdge(at, c))
        at.isLegalEnd = true
        ends.push(at)
    })
    return ends
}


type Node = { name: string, isLegalEnd: boolean } & (Node | undefined)[]

function createNode(cheap: boolean = false): Node {
    // when looking up random indexes, performance is significantly better with manually defined 'undefined' values than letting js do stuff behind the scenes
    // why? theories are:
    // - invalid bounds are slow
    // - 'empty' array indexes compare slowly
    const node = (cheap ? [] : new Array(20000).fill(undefined)) as any as Node
    node.isLegalEnd = false
    return node
}

function getOrCreateEdge(node: Node, v: number): Node {
    return connectEdge(node, v, node[v] || createNode())
}

function connectEdge(node: Node, v: number, other: Node): Node {
    node[v] = other
    return other
}