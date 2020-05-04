let _currencyElementNextId = 1;

class CurrencyElement {
    /**
     * @param {HTMLElement} element
     * @param {{config: Configuration, detector: Detector}} services
     */
    constructor(element, services = {}) {
        this.id = ++_currencyElementNextId;
        this._config = services.config || Configuration.instance;
        this._detector = services.detector || Detector.instance;
        this._element = element;
        this._element.setAttribute('uacc:watched', this.id + '');
        this._original = null;
        this._converted = null;
        this._conversionTo = null;
        this._isShowingConversion = false;
        this.selected = false;
    }

    async convertTo(currency) {
        this._conversionTo = currency;
        this.updateSnapshot();
        await this.convert();
    }

    async showConverted() {
        this._isShowingConversion = true;
        if (this.updateSnapshot()) await this.convert();
        this._converted.display();
    }

    async showOriginal() {
        this._isShowingConversion = false;
        if (this.updateSnapshot()) await this.convert();
        this._original.display();
    }

    async updateDisplay() {
        if (this._isShowingConversion) await this.showConverted();
    }

    async flipDisplay() {
        if (this._isShowingConversion) await this.showOriginal(); else await this.showConverted();
    }

    async setupListener() {
        this._element.classList.add('uacc-clickable');
        if (this._config.utility.click.value)
            this._element.addEventListener('click', () => this.flipDisplay());
        this._element.addEventListener('mouseover', () => {
            if (this._config.utility.hover.value) this.flipDisplay();
            this.selected = true;
        });
        this._element.addEventListener('mouseout', () => {
            if (this._config.utility.hover.value) this.flipDisplay();
            this.selected = false;
        });
    }

    /**
     * @returns {Promise<void>}
     */
    async convert() {
        if (!this._conversionTo) return;
        this._converted = this._original.clone();
        const converted = this._converted.texts;
        const text = this._converted.texts.join(' ');

        let result = await this._detector.detectResult(text);
        result.forEach(e => e.data.reverse());
        for (const element of result) {
            const converted = await element.amount.convertTo(this._conversionTo);
            element.data.filter(e => e.replace).forEach(e => {
                if (this._config.currency.showInBrackets.value)
                    e.text = `${element.amount.amount} ${element.amount.tag} (${converted.toString()})`
                else
                    e.text = converted.toString()
            });
        }
        result = result.reverse();
        const data = result.flatMap(e => e.data);

        let at = converted.length - 1;
        let index = text.length - converted[at].length;
        for (let d of data) {
            while (d.start < index) {
                at--;
                index -= converted[at].length + 1;
            }
            const relativeStart = d.start - index;
            const old = converted[at];

            if (d.replace)
                converted[at] = old.substr(0, relativeStart) + d.text + old.substr(relativeStart + d.length, old.length)
            else converted[at] = old.substr(0, relativeStart) + old.substr(relativeStart + d.length, old.length)
        }
    }

    /**
     * Bool on whether or not the snapshot was updated
     * @returns {boolean}
     */
    updateSnapshot() {
        const snapshot = new ElementSnapshot(this._element);
        if (snapshot.isEqual(this._original)) return false;
        if (snapshot.isEqual(this._converted)) return false;
        this._original = snapshot;
        this._converted = snapshot.clone();
        return true;
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
        if (!element) return;
        const textnodes = [];
        const texts = [];
        const queue = [element];
        while (queue.length > 0) {
            const curr = queue.pop();
            if (curr.nodeType === Node.TEXT_NODE) {
                textnodes.unshift(curr);
            } else if (curr.hasChildNodes())
                for (let i = 0; i < curr.childNodes.length; i++)
                    queue.push(curr.childNodes[i]);
        }
        this._nodes = textnodes;
        this._texts = textnodes.map(e => e.textContent);
    }

    /**
     * @returns {ElementSnapshot}
     */
    clone() {
        const copy = new ElementSnapshot(null);
        copy._nodes = this.nodes.map(e => e);
        copy._texts = this.texts.map(e => e);
        return copy;
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

    display() {
        for (let i = 0; i < this.texts.length; i++)
            this.nodes[i].textContent = this.texts[i];
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