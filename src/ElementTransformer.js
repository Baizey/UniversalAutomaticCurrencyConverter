const ConversionTypes = {
    aggressively: 'aggressively',
    carefully: 'carefully',
    intelligently: 'intelligently'
};

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
        this.type = ConversionTypes.intelligently;
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

    withConversionType(type) {
        if (ConversionTypes[type])
            this.type = type;
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

        const convertedElement = this._chooseTransformType(element, full);

        if (!hasEvents) {
            this.conversions.push(convertedElement);
            element.addEventListener('mouseout', () => mouseIsOver = null);
            element.addEventListener('mouseover', () => mouseIsOver = element);
            element.addEventListener('click', () => convertedElement.flip());
            convertedElement.updateUi();
        }

        if (this.engine.highlighter.isEnabled)
            this.highlightConversion(element)
                .catch(e => Utils.logError(e));

        return convertedElement;
    }

    async highlightConversion(element) {
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
     * @param element
     * @param full
     * @return {ConvertedElement}
     * @private
     */
    _chooseTransformType(element, full) {
        switch (this.type) {
            case ConversionTypes.carefully:
                return this.transformCarefully(element, full);
            case ConversionTypes.aggressively:
                return this.transformAggressively(element, full);
            case ConversionTypes.intelligently:
                return this.transformIntelligently(element, full);
        }
    }

    /**
     * @param {HTMLElement} element
     * @param {boolean} full
     * @return {ConvertedElement}
     */
    transformCarefully(element, full) {
        const detector = this.engine.currencyDetector;
        const textnodes = ElementTransformer.findTextNodes(element).filter(e => detector.contains(e));

        const texts = textnodes.map(node => {
            const oldText = node.textContent;
            const replacements = detector.findAll(node.textContent);
            const newText = replacements.reduce((a, b) => a.replace(b.raw, this.engine.transform(b)), oldText);
            return {new: newText, old: oldText}
        });

        let isNew = false;

        const setOld = () => {
            textnodes.forEach((node, i) => node.textContent = texts[i].old);
            isNew = false;
        };
        const setNew = () => {
            textnodes.forEach((node, i) => node.textContent = texts[i].new);
            isNew = true;
        };

        return new ConvertedElement(element, this.engine)
            .withSetters(setNew, setOld);
    }

    /**
     * @param {HTMLElement} element
     * @param {boolean} full
     * @return {ConvertedElement}
     */
    transformAggressively(element, full) {
        const detector = this.engine.currencyDetector;
        const replacements = detector.findAll(element, full);
        const newText = replacements.reduce((a, b) => a.replace(b.raw, this.engine.transform(b)), element.innerText);
        const oldText = element.innerHTML;

        let isNew = false;

        const setOld = () => {
            element.innerHTML = oldText;
            isNew = false;
        };
        const setNew = () => {
            element.innerText = newText;
            isNew = true;
        };

        return new ConvertedElement(element, this.engine)
            .withSetters(setNew, setOld);
    }

    /**
     * @param {HTMLElement} element
     * @param {boolean} full
     * @return {ConvertedElement}
     */
    transformIntelligently(element, full) {
        const detector = this.engine.currencyDetector;
        const textnodes = ElementTransformer.findTextNodes(element);
        const nodes = textnodes.map((e, i) => ({node: e, index: i, pos: {start: 0, end: 0}}));
        for (let i = 0, at = 0; i < nodes.length; i++) {
            nodes[i].pos.start = at;
            at += nodes[i].node.textContent.length;
            nodes[i].pos.end = at - 1;
        }

        const text = textnodes.map(e => e.textContent).join('');
        const replacements = detector.findAll(text);
        const texts = textnodes.map(e => ({new: e.textContent, old: e.textContent}));

        const relevantNodes = (start, end) => nodes.filter(e => {
            const pos = e.pos;
            return (start >= pos.start && start <= pos.end)
                || (end >= pos.start && end <= pos.end)
                || (start < pos.start && end > pos.end);
        });

        replacements.forEach(replacement => {
            if (replacement.numbers[0] === 0) {
                console.log("");
            }
            const nodes = relevantNodes(replacement.index, replacement.index + replacement.raw.length - 1);
            switch (nodes.length) {
                case 0:
                    break;
                case 1:
                    const simpleText = texts[nodes[0].index];
                    simpleText.new = simpleText.new.replace(replacement.raw, this.engine.transform(replacement));
                    break;
                default:
                    const regex = this.engine.currencyDetector._regex;
                    const result = regex.exec(replacement.raw);
                    let [raw, start, c1, w1, neg, int, dec, w2, c2, end] = result;
                    neg = neg ? neg : '';
                    dec = dec ? dec : '';
                    const rawInteger = neg + int;
                    const rawNumber = neg + int + dec;

                    // Remove currency symbols
                    if (!!this.engine.currencyDetector.currencies[c1]) {
                        const from = replacement.index + start.length;
                        const to = from + c1.length - 1;
                        const toRemoveIn = relevantNodes(from, to);
                        const simpleText = texts[toRemoveIn[0].index];
                        simpleText.new = simpleText.new.replace(c1, '');
                    }
                    if (!!this.engine.currencyDetector.currencies[c2]) {
                        const from = replacement.index + [start, c1, w1, neg, int, dec, w2]
                            .map(e => e ? e.length : 0).sum();
                        const to = from + c2.length - 1;
                        const toRemoveIn = relevantNodes(from, to);
                        const simpleText = texts[toRemoveIn[0].index];
                        simpleText.new = simpleText.new.replace(c2, '');
                    }

                    // Add replacement if integer and decimal is together
                    const nodesWithRawNumber = nodes.filter(e => e.node.textContent.indexOf(rawNumber) >= 0);
                    if (nodesWithRawNumber.length > 0) {
                        const simpleText = texts[nodesWithRawNumber[0].index];
                        simpleText.new = simpleText.new.replace(rawNumber, this.engine.transform(replacement));
                        return;
                    }

                    // Remove decimal parts
                    if (dec) {
                        const simpleDec = dec.replace(/\s/g, '').substr(1);
                        const from = (dec.length - simpleDec.length)
                            + replacement.index
                            + [start, c1, w1, neg, int].map(e => e ? e.length : 0).sum();
                        const to = from + dec.length - 1;
                        const toRemoveIn = relevantNodes(from, to);
                        const simpleText = texts[toRemoveIn[0].index];
                        simpleText.new = simpleText.new.replace(simpleDec, '');
                    }


                    // Add replacement where integer number is
                    const nodesWithRawInteger = nodes.filter(e => e.node.textContent.indexOf(rawInteger) >= 0);
                    if (nodesWithRawInteger.length > 0) {
                        const simpleText = texts[nodesWithRawInteger[0].index];
                        simpleText.new = simpleText.new.replace(rawInteger, this.engine.transform(replacement));
                        return;
                    }
                    break;
            }
        });

        const setOld = () => textnodes.forEach((node, i) => node.textContent = texts[i].old);
        const setNew = () => textnodes.forEach((node, i) => node.textContent = texts[i].new);
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