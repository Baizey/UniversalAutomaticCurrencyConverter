export class ElementSnapshot {

    readonly nodes: Node[]
    readonly texts: string[]

    constructor(node: Node | ElementSnapshot) {
        if (node instanceof ElementSnapshot) {
            this.nodes = node.nodes
            this.texts = node.texts.map(e => e);
            return;
        }
        this.nodes = [];
        const queue: Node[] = [node];
        while (queue.length > 0) {
            const curr = queue.pop();
            if (!curr) break;
            if (curr.nodeType === Node.TEXT_NODE) {
                this.nodes.unshift(curr);
            } else if (curr.hasChildNodes())
                for (let i = 0; i < curr.childNodes.length; i++)
                    queue.push(curr.childNodes[i]);
        }
        this.texts = this.nodes.map(e => e.textContent || '');
    }

    clone(): ElementSnapshot {
        return new ElementSnapshot(this);
    }

    display(): void {
        for (let i = 0; i < this.texts.length; i++)
            this.nodes[i].textContent = this.texts[i];
    }

    isEqual(snapshot: ElementSnapshot | undefined): boolean {
        if (!snapshot) return false;
        if (this.texts.length !== snapshot.texts.length) return false;
        for (let i = 0; i < this.texts.length; i++)
            if (this.texts[i] !== snapshot.texts[i])
                return false;
        return true;
    }
}