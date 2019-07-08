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

    withConversionType(type) {
        if (ConversionTypes[type])
            this.type = type;
    }

    /**
     * @param {HTMLElement} element
     * @param {boolean} full
     */
    transform(element, full = false) {
        if (!element || element.hasAttribute(Tags.converted)) return;

        const hasEvents = element.hasAttribute(Tags.hasEvents);
        element.setAttribute(Tags.converted, 'true');
        element.setAttribute(Tags.hasEvents, 'true');
        element.classList.add('clickable');

        if (!hasEvents) {
            element.addEventListener('mouseout', () => mouseIsOver = null);
            element.addEventListener('mouseover', () => mouseIsOver = element);
            this.conversions.push(element);
        }

        let [flip, set] = [() => undefined, bool => undefined];
        switch (this.type) {
            case ConversionTypes.carefully:
                [flip, set] = this.transformCarefully(element, full);
                break;
            case ConversionTypes.aggressively:
                [flip, set] = this.transformAggressively(element, full);
                break;
            case ConversionTypes.intelligently:
                [flip, set] = this.transformIntelligently(element, full);
                break;
        }

        element.UACCChanger = flip;
        element.UACCSetter = set;

        set(true);
        if (this.engine.highlighter.isEnabled)
            this.highlightConversion(element)
                .catch(e => Utils.logError(e));
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
     * @param {HTMLElement} element
     * @param {boolean} full
     * @return {[function(), function(boolean)]}
     */
    transformCarefully(element, full) {
        const textnodes = this._findTextNodes(element);
        const detector = this.engine.currencyDetector;

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

        const flip = () => isNew ? setOld() : setNew();
        const set = value => value ? setNew() : setOld();
        return [flip, set];
    }

    /**
     * @param {HTMLElement} element
     * @param {boolean} full
     * @return {undefined|[function(), function(boolean)]}
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

        const flip = () => isNew ? setOld() : setNew();
        const set = value => value ? setNew() : setOld();
        return [flip, set];
    }

    /**
     * @param {HTMLElement} element
     * @param {boolean} full
     * @return {undefined|[function(), function(boolean)]}
     */
    transformIntelligently(element, full) {
        const detector = this.engine.currencyDetector;
        const textnodes = this._findTextNodes(element);
        const text = textnodes.map(e => e.textContent).join(' ');
        const replacements = detector.findAll(text);

        const texts = textnodes.map(e => ({new: e.textContent, old: e.textContent}));
        let last = 0;
        replacements.forEach(result => {
            last = text.indexOf(result, last);
            if (last < 0) {
                last = text.length;
                return;
            }
            const touched = this._findTouchedNodes(textnodes, last, last + result.raw.length);

            switch (touched.nodes.length) {
                case 0:
                    // Wait what? BUT I SAW IT... oh shit boi
                    break;
                case 1:
                    texts[touched.start].new = texts[touched.start].new.replace(result.raw, this.engine.transform(result));
                    break;
                default:
                    // Oh shit, this is about to get complicated
                    // 1. find where currency is placed... and remove it... keep the unused... unless it's currency... yeah boi
                    // 2. Find out if decimal is placed with out without integer
                    // 3. Remove decimal if alone
                    // 4. Replace integer (+decimal) with transformation
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
        const flip = () => isNew ? setOld() : setNew();
        const set = value => value ? setNew() : setOld();
        return [flip, set];
    }

    /**
     * @param {Node[]} nodes
     * @param {number} start
     * @param {number} end
     * @return {{nodes: Node[], start: number}}
     * @private
     */
    _findTouchedNodes(nodes, start, end) {
        let i = 0;
        let at = 0;
        while (at <= start) {
            at += nodes[i].textContent.length;
            i++;
        }

        const startIndex = i - 1;
        const result = [nodes[startIndex]];

        while (i <= end) {
            result.push(nodes[i]);
            at += nodes[i].textContent.length;
            i++;
        }

        return {
            start: startIndex,
            nodes: result
        };
    }

    /**
     * @param {HTMLElement} element
     * @return {Node[]}
     * @private
     */
    _findTextNodes(element) {
        const textnodes = [];
        const queue = [element];
        const detector = this.engine.currencyDetector;
        while (queue.length > 0) {
            const curr = queue.pop();
            if (curr.nodeType === Node.TEXT_NODE && detector.contains(curr.textContent))
                textnodes.push(curr);
            else if (curr.hasChildNodes())
                for (let i = 0; i < curr.childNodes.length; i++)
                    queue.push(curr.childNodes[i]);
        }
        return textnodes;
    }

}