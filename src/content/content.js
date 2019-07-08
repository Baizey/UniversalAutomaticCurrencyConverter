const convertedTag = 'UACC_converted';
const hasEventsTag = 'UACC_hasEvents';
const ignoredElements = {
    'script': true,
    'rect': true,
    'svg': true
};
let mouseIsOver = null;

class UACCContent {
    constructor() {
        this.engine = new Engine();
        this.detector = this.engine.currencyDetector;
        this.loader = this.engine.loadSettings();
        this._conversions = [];
    }

    get conversions() {
        return this._conversions;
    }

    get conversionCount() {
        return this._conversions.length;
    }

    setAll(converted) {
        const self = this;
        if (this.engine.highlighter.isEnabled)
            this._conversions.forEach(e => {
                e.UACCSetter(converted);
                self.engine.elementTransformer.highlightConversion(e).finally();
            });
        else
            this._conversions.forEach(e => e.UACCSetter(converted));
    }

    hasChildrenBeyond(element, limit, depth = 0) {
        if (!element || !element.children) return false;
        const children = element.children;

        if (limit <= depth)
            return children.length > 0;

        for (let i = 0; i < children.length; i++)
            if (this.hasChildrenBeyond(children[i], limit, depth + 1))
                return true;

        return false;
    }

    childrenHasCurrency(element) {
        for (let i = 0; i < element.children.length; i++)
            if (this.engine.currencyDetector.contains(element.children[i]))
                return true;
        return false;
    }

    convertElements(start) {
        const queue = [start];
        const detector = this.engine.currencyDetector;

        while (queue.length > 0) {
            const curr = queue.pop();

            if (ignoredElements[curr.tagName])
                continue;

            if (this.hasChildrenBeyond(curr, 3)) {
                for (let i = 0; i < curr.children.length; i++)
                    queue.push(curr.children[i]);
                continue;
            }

            if (!detector.contains(curr)) {
                continue;
            }

            if (detector.contains(curr, true)) {
                if (!curr.children || (curr.children.length === 1 && curr.innerText !== curr.children[0].innerText)) {
                    this.engine.elementTransformer.transform(curr, true);
                    continue;
                }
            }

            if (this.childrenHasCurrency(curr)) {
                for (let i = 0; i < curr.children.length; i++)
                    queue.push(curr.children[i]);
                continue;
            }

            this.engine.elementTransformer.transform(curr);
        }
    }
}

Timer.start('Loading settings');
const runner = new UACCContent();

/**
 * @param callback
 * @param data
 * @return {true|data}
 */
const handleResponding = (callback, data) => Browser.isFirefox() ? data : !callback(data) || true;

chrome.runtime.onMessage.addListener(
    async function (data, sender, senderResponse) {
        switch (data.method) {
            case 'contextMenu':
                const text = data.text;
                if (!text) return handleResponding(senderResponse);
                const result = runner.engine.currencyDetector.findAll(text);
                if (result.length === 0) return handleResponding(senderResponse);

                const settings = await Browser.load(['popupCurrencies', 'popupAmounts']);
                settings['popupCurrencies'] = settings['popupCurrencies'] || [];
                settings['popupAmounts'] = settings['popupAmounts'] || [];

                result.forEach(r => {
                    r.numbers.forEach(number => {
                        settings['popupCurrencies'].push(r.currency);
                        settings['popupAmounts'].push(number);
                    });
                });

                await Browser.save(settings);
                await Browser.messageBackground({method: 'openPopup'});
                break;
            case 'getLocalization':
                return handleResponding(senderResponse, runner.engine.currencyDetector.currencies[data.symbol]);
            case 'setLocalization':
                const to = data.to;
                if (!(/^[A-Z]{3}$/.test(to)))
                    return handleResponding(senderResponse);
                const currencies = runner.engine.currencyDetector.currencies;
                switch (data.symbol) {
                    case '$':
                        currencies['$'] = to;
                        currencies['dollar'] = to;
                        currencies['dollars'] = to;
                        break;
                    case 'kr':
                        currencies['kr.'] = to;
                        currencies['kr'] = to;
                        currencies[',-'] = to;
                        break;
                    case '¥':
                        currencies['¥'] = to;
                        break;
                }
                runner.conversions.forEach(c => c.UACCSetter(false));
                runner.conversions.forEach(c => c.removeAttribute(convertedTag));
                runner.conversions.forEach(c => runner.engine.elementTransformer.transformElement(c));
                return handleResponding(senderResponse);
            case 'convertAll':
                runner.setAll(data.converted);
                return handleResponding(senderResponse);
            case 'conversionCount':
                return handleResponding(senderResponse, runner.conversionCount);
            case 'getUrl':
                return handleResponding(senderResponse, window.location.href);
        }
    }
);

runner.loader.then(r => {
    Timer.log('Loading settings');
    return r;
});

runner.loader.finally(() => {
    const engine = runner.engine;

    if (!engine.isEnabled)
        return Utils.log('content', 'UACC is disabled');

    if (engine.blacklist.isEnabled && engine.blacklist.isBlacklisted(window.location.href))
        return;

    if (engine.whitelist.isEnabled && !engine.whitelist.isBlacklisted(window.location.href))
        return;

    Timer.start('Localization');
    engine.currencyDetector.localize(Browser.getHost(), document.body.innerText);
    Timer.log('Localization');

    if (engine.automaticPageConversion) {
        Timer.start('Converting page');
        runner.convertElements(document.body);
        Timer.log('Converting page');

        Browser.messagePopup({
            method: 'conversionCount',
            count: runner.conversionCount
        }).finally();

        const observer = new MutationObserver(function (mutations) {
            for (let i = 0; i < mutations.length; i++)
                for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                    const parent = mutations[i].addedNodes[j].parentElement;
                    if (parent && parent.hasAttribute(convertedTag))
                        continue;
                    runner.convertElements(mutations[i].addedNodes[j]);
                }
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener("keyup", e => {
        // Secure element in case it changes between check and execution
        if (e.key !== engine.conversionShortcut)
            return;

        const securedOver = mouseIsOver;
        if (securedOver)
            return securedOver.UACCChanger();

        let parent;
        if (!(parent = window.getSelection()))
            return;

        if (!(parent = parent.anchorNode))
            return;
        if (!(parent = parent.parentElement))
            return;
        if (!(parent = parent.parentElement))
            return;

        runner.convertElements(parent);
        parent.setAttribute(convertedTag, 'true');
    }, false);
    Timer.log();
});