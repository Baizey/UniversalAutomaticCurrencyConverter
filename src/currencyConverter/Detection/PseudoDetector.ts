import {PseudoNode} from "./pseudoTypes";
import {TextDetector, TextDetectorDi} from "./TextDetector";

export type PseudoDetectorDi = {
    pseudoDetector: PseudoDetector
}

export class PseudoDetector {
    private readonly textDetector: TextDetector;

    constructor({textDetector}: TextDetectorDi) {
        this.textDetector = textDetector
    }

    find(element: PseudoNode, cache: Record<number, string>): number[] {
        if (!element) return []
        if (element.watched) return []
        if (!this.detect(element, cache)) return []

        const result = element.children
            .filter(e => typeof e !== 'string')
            .map(e => this.find(e as PseudoNode, cache))
            .flatMap(e => e)
        if (result.length > 0) return result


        return this.isConvertable(element, 3)
            ? [element.id]
            : []
    }

    private detect(element: PseudoNode, cache: Record<number, string>): boolean {
        return this.textDetector.detect(this.asText(element, cache))
    }

    asText(node: PseudoNode, cache: Record<number, string>): string {
        let value = ''
        if (cache[node.id]) return cache[node.id]
        node.children.forEach(child => {
            if (typeof child === 'string') value += ' ' + child
            else {
                value += ' ' + this.asText(child, cache)
            }
        })
        cache[node.id] = value
        return value
    }

    private isConvertable(element: PseudoNode, maxDepth: number): boolean {
        return maxDepth < 0 || element.watched
            ? false
            : element.children.every(child => typeof child === 'string'
                ? true
                : this.isConvertable(child, maxDepth - 1))
    }
}