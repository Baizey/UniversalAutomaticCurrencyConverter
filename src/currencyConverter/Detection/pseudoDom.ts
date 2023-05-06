import {PseudoNode} from "./pseudoTypes";
import {Stateful} from "@baizey/dependency-injection";

export type PseudoDomDi = {
    pseudoDom: Stateful<HTMLElement, PseudoDom>
}

export class PseudoDom {
    readonly root: PseudoNode

    private nextId = 0
    private readonly lookup: Record<number, undefined | { pseudo: PseudoNode, real: Node }> = {}

    constructor(provider: {}, element: HTMLElement) {
        const isWatched = this.detectConverterTagUp(element)
        this.root = this.createPseudoNode(element, isWatched)[0] as PseudoNode
    }

    element(id: number): Node | undefined {
        return this.lookup[id]?.real
    }

    pseudo(id: number): PseudoNode | undefined {
        return this.lookup[id]?.pseudo
    }

    private createPseudoNode(node: Node, isWatched: boolean): (PseudoNode | string)[] {
        switch (node.nodeType) {
            case Node.TEXT_NODE:
                return [node.textContent || '']
            case Node.ELEMENT_NODE:
                if (!(node instanceof HTMLElement)) return []
                const tagName = node.tagName.toLowerCase()
                if (this.ignoredTag(tagName)) return []
                isWatched ||= node.hasAttribute('uacc:watched')
                const children = node.hasChildNodes()
                    ? [...node.childNodes]
                        .map(e => this.createPseudoNode(e, isWatched))
                        .flatMap(e => e)
                    : []
                const result = {
                    id: ++this.nextId,
                    watched: isWatched,
                    children,
                    tagName,
                } satisfies PseudoNode
                this.lookup[result.id] = {pseudo: result, real: node}
                return [result]
            default:
                return node.hasChildNodes()
                    ? [...node.childNodes]
                        .map(e => this.createPseudoNode(e, isWatched))
                        .flatMap(e => e)
                    : []
        }
    }

    private ignoredTag(tag: string) {
        switch (tag) {
            case 'style':
            case 'script':
            case 'noscript':
            case 'svg':
            case 'img':
            case 'br':
                return true
            default:
                return false
        }
    }

    private detectConverterTagUp(element: Element | null): boolean {
        if (!element) return false
        if (element.hasAttribute('uacc:watched')) return true
        return this.detectConverterTagUp(element.parentElement)
    }
}