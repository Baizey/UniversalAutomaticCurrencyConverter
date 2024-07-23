import {PseudoNode} from "./pseudoTypes";
import {FlatResult, TextFlat, TextFlatDi} from "./TextFlat";

export type PseudoFlatDi = {
    pseudoFlat: PseudoFlat
}

export class PseudoFlat {
    private readonly textDetector: TextFlat;

    constructor({textFlat}: TextFlatDi) {
        this.textDetector = textFlat
    }

    find(element: PseudoNode): number[] {
        const startIndexes: Record<number, number> = {}
        const endIndexes: Record<number, number> = {}

        const text = toText(element, startIndexes, endIndexes, 0)
        const matches = this.textDetector.find(text)
        const results: Record<number, number> = {}
        matches.forEach(e => traverse(element, e))
        return Object.values(results)

        function traverse(node: PseudoNode, match: FlatResult): boolean {
            const rangeStart = startIndexes[node.id]
            const rangeEnd = endIndexes[node.id]
            const matchStart = match.startIndex
            const matchEnd = match.endIndex

            const contains = rangeStart <= matchStart && matchEnd <= rangeEnd;
            if (!contains) return false;

            let found = false
            for (const child of node.children) {
                if (typeof child === 'string') continue
                found ||= traverse(child, match)
            }
            if (found) return true

            if (isConvertable(node, 3)) {
                results[node.id] = node.id
                return true
            }

            return false
        }

        function toText(node: PseudoNode, startIndexes: Record<number, number>, endIndexes: Record<number, number>, index: number): string {
            let value = ''
            startIndexes[node.id] = index
            for (const child of node.children) {
                if (typeof child === 'string') value += ' ' + child
                else value += toText(child, startIndexes, endIndexes, index + value.length)
            }
            endIndexes[node.id] = index + value.length
            return value
        }

        function isConvertable(element: PseudoNode, maxDepth: number): boolean {
            return maxDepth < 0 || element.watched
                ? false
                : element.children.every(child => typeof child === 'string' || isConvertable(child, maxDepth - 1))
        }
    }
}