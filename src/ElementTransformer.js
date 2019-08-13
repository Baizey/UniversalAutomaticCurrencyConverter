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
        this.type = ConversionTypes.aggressively;
        this.engine = engine;
        this.conversions = [];
    }

    setAll(value) {
        this.conversions.forEach(c => c.UACCSetter(value));
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

        const text = textnodes.map(e => e.textContent).join('');
        const replacements = detector.findAll(text);
        const texts = textnodes.map(e => ({new: e.textContent, old: e.textContent}));

        const find = replacement => {
            const start = replacement.index;
            const end = replacement.index + replacement.raw.length;
            let at = 0;
            return textnodes
                .map((e, i) => ({node: e, index: i}))
                .filter(e => {
                    const temp = at + e.node.textContent.length;
                    const result = (at >= start && at < end) || (temp > start && temp <= end);
                    at = temp;
                    return result;
                });
        };

        replacements.forEach(replacement => {
            const nodes = find(replacement);
            switch (nodes.length) {
                case 0:
                    throw "Not supposed to happen, turn back";
                case 1:
                    const simpleText = texts[nodes[0].index];
                    simpleText.new = simpleText.new.replace(replacement.raw, this.engine.transform(replacement));
                    break;
                default:
                    // Oh shit

                    break;
            }
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
     * @param {Element} element
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
        this.setOld = () => {
        };
        this.setNew = () => {
        };
        this._flip = () => {
        };
        this._set = () => {
        };
    }

    withSetters(setNew, setOld = undefined) {
        this.setOld = setOld ? setOld : this.setOld;
        this.setNew = setNew;
        return this;
    }

    updateUi() {
        const setNew = this.setNew;
        const setOld = this.setOld;
        const self = this;

        let isNew = false;
        this._set = value => isNew = value ? (setNew() || true) : (setOld() && false);
        this._flip = () => self._set(!isNew);
        this.element.UACCSetter = this._set;
        this.element.UACCChanger = this._flip;
        this._set(true);
        
        return this;
    }

    set(value) {
        this._set(value);
    }

    flip() {
        this._flip();
    }

    updateSetters() {
        this.set(false);
        const result = this.engine.elementTransformer.transform(this.element);
        this.withSetters(result.setNew).updateUi();
    }

}