import {PseudoNode} from "./pseudoTypes";
import {TextDetector, TextDetectorDi} from "./index";

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

        if (this.isElementUnavailable(element, 3)) return []
        return [element.id]
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

    private isElementUnavailable(element: PseudoNode, maxDepth: number): boolean {
        if (maxDepth < 0) return true
        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i]
            if (typeof child === 'string') continue
            if (this.isElementUnavailable(child, maxDepth - 1)) {
                return true
            }
        }
        return false
    }
}