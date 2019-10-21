const convertedTag = 'UACC_converted';
const hasEventsTag = 'UACC_hasEvents';
const ignoredElements = {
    'script': true,
    'rect': true,
    'svg': true
};

/**
 * Hint for future developers:
 * DO NOT DO WHAT THESE WEBSITES DO
 * @type {{"taobao.com": {delay: number}}}
 */
const shittyWebsites = {
    'taobao.com': {
        delay: 3000,
    }
};

let mouseIsOver = null;

class UACCContent {
    constructor() {
        this.engine = new Engine();
        this.loader = this.engine.loadSettings();
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
        const transformer = runner.engine.elementTransformer;
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
                runner.engine.localization.site.setOverrideable(true);
                runner.engine.localization.site.setDefaultLocalization(to);
                runner.engine.currencyDetector.updateLocalizationCurrencies();
                await runner.engine.saveSiteSpecificSettings();
                transformer.updateAll();
                return handleResponding(senderResponse);
            case 'convertAll':
                transformer.setAll(data.converted);
                return handleResponding(senderResponse);
            case 'conversionCount':
                return handleResponding(senderResponse, transformer.conversions.length);
            case 'getUrl':
                return handleResponding(senderResponse, Browser.hostname);
        }
    }
);

runner.loader.finally(async () => {
    const shittySite = shittyWebsites[Browser.absoluteHostname()];
    if (shittySite)
        await Utils.wait(shittySite.delay);

    Timer.log('Loading settings');
    const engine = runner.engine;

    if (engine.blacklist.isEnabled && engine.blacklist.isBlacklisted(window.location.href))
        return;

    if (engine.whitelist.isEnabled && !engine.whitelist.isBlacklisted(window.location.href))
        return;

    Timer.start('Localization');
    const replacements = engine.currencyDetector.localize(Browser.getHost(), document.body.innerText);
    Timer.log('Localization');

    if (replacements.length > 0 && engine.showNonDefaultCurrencyAlert) {
        // Alert user about replacements
        const content = replacements.map(e =>
            `<div style="text-align: center" class="line">
    <span style="width:50%; float: left">Detected ${e.detected}</span>
    <span style="width:50%; float: left">Default's ${e.default}</span>
</div>`).join('');

        const bodyColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
        const rawColors = bodyColor.match(/\d+/g).map(e => Number(e));
        const reverseColors = rawColors.slice(0, 3).map(e => (e + 128) % 255);
        const colors = rawColors.map(e => e * 0.85);
        const backgroundColor = colors.length === 3
            ? 'rgb(' + colors.join(',') + ')'
            : 'rgba(' + colors.map(e => Math.max(e, .9)).join(',') + ')';
        const borderColor = colors.length === 3
            ? 'rgb(' + colors.map(e => e * 0.85).join(',') + ')'
            : 'rgba(' + colors.map(e => e * 0.85).map(e => Math.max(e, .9)).join(',') + ')';
        const textColor = (colors.slice(0, 3).sum() / 3) >= 128 ? '#111' : '#eee';

        const reverseBorderColor = 'rgb(' + reverseColors.join(',') + ')';
        const reverseBackgroundColor = 'rgb(' + reverseColors.map(e => e * 0.85).join(',') + ')';
        const reverseTextColor = textColor === '#eee' ? '#111' : '#eee';

        const html = `<div class="alertWrapper" style="background-color:${backgroundColor}; color: ${textColor}; border: 1px solid ${borderColor}">
    <span class="line" style="font-size: 10px; margin-bottom: 0; padding-bottom: 0">Universal Automatic Currency Converter</span>
    <h2 class="line" style="margin-top: 0; padding-top: 0">${Browser.hostname}</h2>
    <div class="line">${content}</div>
    
    <div class="line" style="height:55px">
        <div style="width:50%; float: left">
            <label class="center" style="font-weight: bold" for="uacc-using-detected">Use detected</label>
            <div style="margin:auto; background-color: ${reverseBackgroundColor}; border-color: ${reverseBorderColor}" class="radiobox checked" id="uacc-using-detected">
                <div></div>
            </div>
        </div>
        <div style="width:50%; float: left">
            <label class="center" style="font-weight: bold" for="uacc-using-defaults">Use defaults</label>
            <div style="margin:auto; background-color: ${reverseBackgroundColor}; border-color: ${reverseBorderColor}" class="radiobox" id="uacc-using-defaults">
                <div></div>
            </div>
        </div>
    </div>
    <div class="saveAndDismissLocalizationButton" id="uacc-save">Save as site defaults and dont ask again</div>
    <div class="dismissLocalizationButton" id="uacc-dismiss">Dismiss alert</div>
    <p class="line" style="font-size:12px;">You can always change site specific localization in the mini-converter popup</p>
    <p class="line" style="font-size:12px;">This alert self destructs in <span id="uacc-countdown">60</span> seconds</p>
</div>`;
        const element = Utils.parseHtml(html);
        document.body.append(element);

        const removeAlert = (fast = false) => {
            if (fast) element.classList.add('fastRemove');
            element.style.opacity = '0';
            setTimeout(() => element.remove(), 1000);
        };

        document.getElementById('uacc-dismiss').addEventListener('click', async () => {
            removeAlert(true);
        });

        document.getElementById('uacc-save').addEventListener('click', async () => {
            engine.localization.site.setOverrideable(false);
            await engine.saveSiteSpecificSettings();
            removeAlert(true);
        });

        const detected = document.getElementById('uacc-using-detected');
        const defaults = document.getElementById('uacc-using-defaults');
        Utils.initializeRadioBoxes([detected, defaults]);
        detected.addEventListener('change', () => {
            replacements.forEach(e => engine.localization.site.setDefaultLocalization(e.detected));
            engine.currencyDetector.updateLocalizationCurrencies();
            engine.elementTransformer.updateAll();
        });
        defaults.addEventListener('change', () => {
            replacements.forEach(e => engine.localization.site.setDefaultLocalization(e.default));
            engine.currencyDetector.updateLocalizationCurrencies();
            engine.elementTransformer.updateAll();
        });

        const expire = Date.now() + 60000;
        const countdown = document.getElementById('uacc-countdown');
        const timer = setInterval(() => {
            const now = Date.now();
            if (now > expire) {
                clearInterval(timer);
                removeAlert();
                countdown.innerText = '0';
            } else
                countdown.innerText = Math.round((expire - now) / 1000) + '';
        }, 1000);
        element.style.opacity = '1';
    }

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