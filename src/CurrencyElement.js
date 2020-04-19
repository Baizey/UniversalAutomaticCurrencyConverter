class CurrencyElement {
    /**
     * @param {HTMLElement} element
     * @param {{config: Configuration}} services
     */
    constructor(element, services = {}) {
        this._config = services.config || Configuration.instance;
        this._element = element;
        this._element.setAttribute('uacc:watched', 'true');
        this._original = null;
        this._converted = null;
    }

    /**
     * @param {string} currency
     * @returns {Promise<void>}
     */
    async convertTo(currency) {
        this.updateSnapshot();
        // TODO: convert currencies in text nodes
    }

    /**
     * Bool on whether or not the snapshot was updated
     * @returns {boolean}
     */
    updateSnapshot() {
        // If no conversion exist, we can assume this is clean and we should snapshot whatever is here
        if (!this._converted) {
            this._original = new ElementSnapshot(this._element);
            return true;
        }

        // Otherwise only update snapshot if it's different from both stored snapshots
        const snapshot = new ElementSnapshot(this._element);
        if (!snapshot.isEqual(this._converted) && !snapshot.isEqual(this._original)) {
            this._original = snapshot;
            return true;
        }

        return false;
    }

    highlight() {
        if (!this._config.highlight.using.value) return;
        const color = this._config.highlight.color.value;
        const duration = this._config.highlight.duration.value;
        this._element.style.textShadow = `${color}  2px 0px 2px, ${color} -2px 0px 2px, ${color}  4px 0px 4px, ${color} -4px 0px 4px, ${color}  6px 0px 6px, ${color} -6px 0px 6px`;
        setTimeout(() => this._element.style.textShadow = '', Math.max(1, duration));
    }
}

class ElementSnapshot {
    /**
     * @param {Node} element
     */
    constructor(element) {
        const textnodes = [];
        const texts = [];
        const queue = [element];
        while (queue.length > 0) {
            const curr = queue.pop();
            if (curr.nodeType === Node.TEXT_NODE) {
                textnodes.unshift(curr);
                texts.unshift(curr.text);
            } else if (curr.hasChildNodes())
                for (let i = 0; i < curr.childNodes.length; i++)
                    queue.push(curr.childNodes[i]);
        }
        this._nodes = textnodes;
        this._texts = texts;
    }

    /**
     * @returns {[string]}
     */
    get texts() {
        return this._texts;
    }

    /**
     * @returns {[Node]}
     */
    get nodes() {
        return this._nodes;
    }

    /**
     * @param {ElementSnapshot} snapshot
     * @returns {boolean}
     */
    isEqual(snapshot) {
        if (!snapshot) return false;
        if (this.texts.length !== snapshot.texts.length) return false;
        for (let i = 0; i < this.texts.length; i++)
            if (this.texts[i] !== snapshot.texts[i])
                return false;
        return true;
    }
}