const Tags = {
    converted: 'UACC_converted',
    inserted: 'UACC_inserted',
    hasEvents: 'UACC_hasEvents'
};

class ElementTransformer {

    /**
     * @param {Engine} engine
     */
    constructor(engine) {
        this.engine = engine;
        this.conversions = [];
    }

    updateAll() {
        this.conversions.forEach(e => e.updateSetters());
    }

    /**
     * @param {boolean} value
     */
    setAll(value) {
        this.conversions.forEach(c => c.set(value));
    }

    /**
     * @param {HTMLElement} element
     * @param {boolean} full
     * @param {boolean} ignoreTags
     * @return {ConvertedElement|undefined}
     */
    transform(element, full = false, ignoreTags = false) {
        if (!element || (!ignoreTags && element.hasAttribute(Tags.converted)))
            return;

        const hasEvents = element.hasAttribute(Tags.hasEvents);
        element.setAttribute(Tags.converted, 'true');
        element.setAttribute(Tags.hasEvents, 'true');
        element.classList.add('clickable');

        const convertedElement = this.transformIntelligently(element, full);

        if (!hasEvents) {
            this.conversions.push(convertedElement);
            element.addEventListener('mouseout', () => mouseIsOver = null);
            element.addEventListener('mouseover', () => mouseIsOver = element);
            element.addEventListener('click', () => convertedElement.flip());
            convertedElement.updateUi();
        }

        this.highlightConversion(element).catch(e => Utils.logError(e));

        return convertedElement;
    }

    async highlightConversion(element) {
        if (!this.engine.highlighter.isEnabled)
            return;
        const highlighter = this.engine.highlighter;
        const duration = highlighter.duration;
        const oldColor = element.style.backgroundColor;
        element.classList.add('highlighted');
        element.style.backgroundColor = highlighter.color;
        await Utils.wait(duration);
        element.classList.add('hiddenHighlight');
        element.style.backgroundColor = oldColor;
        await Utils.wait(5 * duration);
        element.classList.remove('highlighted', 'hiddenHighlight');
    }

    /**
     * @param {HTMLElement} element
     * @param {boolean} full
     * @return {ConvertedElement}
     */
    transformIntelligently(element, full) {
        const detector = this.engine.currencyDetector;
        const textnodes = ElementTransformer.findTextNodes(element);
        let at = 0;
        const data = textnodes.map((e, i) => {
            const start = at;
            at += e.textContent.length;
            return {
                node: e,
                index: i,
                old: {
                    text: e.textContent,
                    start: start,
                    end: at - 1
                },
                new: {
                    text: e.textContent,
                    start: 0,
                    end: 0
                }
            }
        });

        const text = textnodes.map(e => e.textContent).join('');
        const replacements = detector.findAll(text);

        Array.prototype.relevant = function (start, end, old) {
            return this.filter(e => {
                const pos = old ? e.old : e.new;
                return (start >= pos.start && start <= pos.end)
                    || (end >= pos.start && end <= pos.end)
                    || (start < pos.start && end > pos.end)
            });
        };

        const removePart = (touched, start, end, replaceWith = '') => {
            const nodes = touched.relevant(start, end - 1, false);
            if (nodes.length === 1) {
                const temp = nodes[0].new.text;
                const offset = nodes[0].new.start;
                nodes[0].new.text = temp.substr(0, start - offset) + replaceWith + temp.substr(end - offset);
            }
        };

        replacements.forEach(replacement => {
            // Find nodes this replacement crosses over
            const oldStart = replacement.index;
            const oldEnd = oldStart + replacement.raw.length - 1;
            const touched = data.relevant(oldStart, oldEnd, true);

            // Handle simple cases
            if (touched.length === 0) return;

            // Update indexes of new text for relevant nodes
            let at = 0;
            touched.forEach(t => {
                t.new.start = at;
                at += t.new.text.length;
                t.new.end = at - 1;
            });

            // Find indexes in new text
            const newText = touched.map(e => e.new.text).join('');
            const newStart = newText.indexOf(replacement.raw);

            const regex = this.engine.currencyDetector._regex;
            const result = regex.exec(replacement.raw);
            let [raw, start, c1, w1, neg, int, dec, w2, c2, end] = result;
            start = start ? start : '';
            w1 = w1 ? w1 : '';
            w2 = w2 ? w2 : '';
            c1 = c1 ? c1 : '';
            neg = neg ? neg : '';
            dec = dec ? dec : '';

            // Remove last currency
            if (this.engine.currencyDetector.currencies[c2]) {
                const currencyStart = newStart + [start, c1, w1, neg, int, dec, w2].map(e => e.length).sum();
                const currencyEnd = currencyStart + c2.length;
                removePart(touched, currencyStart, currencyEnd);
            }

            // Remove whole number
            const rawNumber = neg + int + dec;
            const numberStart = newStart + [start, c1, w1].map(e => e ? e.length : 0).sum();
            const numberEnd = numberStart + rawNumber.length;
            const temp = touched.relevant(numberStart, numberEnd - 1, false);
            if (temp.length === 1) {
                removePart(touched, numberStart, numberEnd, this.engine.transform(replacement));
            } else {
                if (dec) {
                    // Remove decimal number(s)
                    const withoutPoint = dec.replace(/^[\s,.]+/, '');
                    const skip = dec.length - withoutPoint.length;
                    const decimalStart = newStart + [start, c1, w1, neg, int].map(e => e ? e.length : 0).sum() + skip;
                    const decimalEnd = decimalStart + withoutPoint.length;
                    removePart(touched, decimalStart, decimalEnd);
                    // Remove decimal point
                    const pointStart = newStart
                        + [start, c1, w1, neg, int].map(e => e ? e.length : 0).sum()
                        + dec.search(/[,.]/);
                    const pointEnd = pointStart + 1;
                    removePart(touched, pointStart, pointEnd);
                }
                // Remove integer
                const rawInteger = neg + int;
                const integerStart = newStart + [start, c1, w1].map(e => e ? e.length : 0).sum();
                const integerEnd = integerStart + rawInteger.length;
                removePart(touched, integerStart, integerEnd , this.engine.transform(replacement));
            }

            // Remove first currency
            if (this.engine.currencyDetector.currencies[c1]) {
                const currencyStart = newStart + [start].map(e => e ? e.length : 0).sum();
                const currencyEnd = currencyStart + c1.length;
                removePart(touched, currencyStart, currencyEnd);
            }
        });

        const setOld = () => data.forEach(e => e.node.textContent = e.old.text);
        const setNew = () => data.forEach(e => e.node.textContent = e.new.text);
        return new ConvertedElement(element, this.engine).withSetters(setNew, setOld);
    }

    /**
     * @param {Element|Node} element
     * @return {Node[]}
     */
    static findTextNodes(element) {
        const textnodes = [];
        const queue = [element];
        while (queue.length > 0) {
            const curr = queue.pop();
            if (curr.nodeType === Node.TEXT_NODE)
                textnodes.unshift(curr);
            else if (curr.hasChildNodes())
                for (let i = 0; i < curr.childNodes.length; i++)
                    queue.push(curr.childNodes[i]);
        }
        return textnodes;
    }

}

class ConvertedElement {
    constructor(element, engine) {
        this.engine = engine;
        this.element = element;
        this.setOld = null;
        this.setNew = null;
        this._flip = null;
        this._set = null;
    }

    set(asNew) {
        this._set(asNew);
    }

    flip() {
        this._flip();
    }

    updateUi() {
        const setNew = this.setNew;
        const setOld = this.setOld;
        const self = this;

        this.isNew = false;
        this._set = value => this.isNew = value ? (setNew() || true) : (setOld() && false);
        this._flip = () => self._set(!this.isNew);

        this.element.UACCSetter = this._set;
        this.element.UACCChanger = this._flip;
        this.set(true);
        return this;
    }

    withSetters(setNew, setOld = undefined) {
        this.setOld = setOld ? setOld : this.setOld;
        this.setNew = setNew;
        return this;
    }

    updateSetters() {
        this.set(false);
        const result = this.engine.elementTransformer.transform(this.element, false, true);
        this.withSetters(result.setNew).updateUi();
        return this;
    }

}