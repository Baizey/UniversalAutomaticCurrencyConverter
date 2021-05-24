import {CurrencyRateLookup} from './CurrencyRateApiProxy';

export class CurrencyRateNode {
    readonly tag: string
    readonly to: Record<string, CurrencyRateEdge>

    constructor(tag: string) {
        this.tag = tag;
        this.to = {}
    }

    toString(): string {
        return this.tag
    }
}

export interface CurrencyRateEdge {
    source: string,
    from: CurrencyRateNode
    to: CurrencyRateNode
    rate: number
    timestamp: number;
}

export interface Conversion {
    from: string
    to: string
    rate: number
    path: CurrencyRateEdge[]
}

export class CurrencyRateGraph {
    readonly nodes: Record<string, CurrencyRateNode> = {}
    readonly currencies: Record<string, Record<string, Conversion>> = {}

    constructor(rawRates: CurrencyRateLookup) {
        Object.entries(rawRates).map(([from, data]) => {
            const fromNode: CurrencyRateNode = this.nodes[from] = this.nodes[from] || new CurrencyRateNode(from)
            Object.entries(data).forEach(([to, rate]) => {
                const toNode: CurrencyRateNode = this.nodes[to] = this.nodes[to] || new CurrencyRateNode(to)
                fromNode.to[to] = {
                    source: rate.source,
                    from: fromNode,
                    to: toNode,
                    rate: rate.rate,
                    timestamp: rate.timestamp
                }

                if (!toNode.to[from]) toNode.to[from] = {
                    source: rate.source,
                    from: toNode,
                    to: fromNode,
                    rate: 1 / rate.rate,
                    timestamp: rate.timestamp
                }

            })
        })
    }

    private find(from: string, to: string): Conversion | null {
        if (!this.nodes[from]) return null;
        const lookup: Record<string, Conversion> = {
            [from]: {
                from: from,
                to: from,
                rate: 1,
                path: []
            }
        }
        const queue: CurrencyRateNode[] = [this.nodes[from]]

        while (queue.length > 0) {
            const at = queue.pop()
            if (!at) continue
            Object.values(at.to).forEach(edge => {
                if (lookup[edge.to.tag]) return;
                lookup[edge.to.tag] = {
                    from: from,
                    to: edge.to.tag,
                    rate: lookup[at.tag].rate * edge.rate,
                    path: lookup[at.tag].path.concat([edge])
                }
                queue.push(edge.to)
            })
        }

        this.currencies[from] = lookup;
        return this.currencies[from][to];
    }

    rate(from: string, to: string): Conversion | null {
        if (this.currencies[from])
            return this.currencies[from][to];
        return this.find(from, to);
    }

}