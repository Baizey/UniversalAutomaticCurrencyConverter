const everything = new Timer();

async function detectAllElements(parent) {
    const currency = Configuration.instance.currency.tag.value;
    const autoConvert = Configuration.instance.utility.using.value;
    const elements = (await Detector.instance.detectAllElements(parent)) || [];
    for (let element of elements) {
        await element.convertTo(currency);
        await element.setupListener();
        if (autoConvert) {
            await element.showConverted();
            element.highlight();
        }
    }
    return elements;
}

/**
 * @param time
 * @returns {Promise<CurrencyElement[]>}
 */
async function convertOrTryAgain(time = 500) {
    if (time > 5000) return [];
    const elements = await detectAllElements(document.body);
    if (elements.length === 0) {
        await Utils.wait(time);
        return await convertOrTryAgain(time * 2);
    }
    return elements;
}

Engine.instance.load().finally(async () => {
    const browser = Browser.instance;
    const detector = Detector.instance;
    const config = Configuration.instance;
    const localization = ActiveLocalization.instance;
    const siteAllowance = SiteAllowance.instance;
    const currency = config.currency.tag.value;
    const shortcut = config.utility.shortcut.value;
    const alert = config.alert.localization.value;

    // Handle allowance by black/white listing
    if (!siteAllowance.isAllowed(browser.href))
        return console.log('UACC: Site is blacklisted, goodbye');

    // Detect localization for website
    const timer = new Timer();
    await localization.determineForSite(document.body.innerText);
    await detector.updateSharedLocalizations();
    timer.log('Checked localization...').reset();

    if (alert && (await localization.hasConflict())) {
        // TODO: show alert
    }

    // Convert currencies
    timer.reset();
    let elements = await convertOrTryAgain();
    timer.log(`Converted page, ${elements.length} conversions...`).reset();

    // Shortcut activation
    window.addEventListener('keyup', e => {
        if (e.key !== shortcut) return;
        // TODO: Maybe optimize? this could be costly on sites with a lot of conversions
        elements.filter(e => e.selected).forEach(e => e.flipDisplay());
    });

    function hasWatchedParent(target) {
        if (!target) return false;
        if (target.hasAttribute('uacc:watched')) return target.getAttribute('uacc:watched');
        return hasWatchedParent(target.parent);
    }

    // TODO: listen for newly added elements for conversion
    const observerConfig = {attributes: true, childList: true, subtree: true}
    const observer = new MutationObserver(async list => {
        for (let data of list) {
            let target = data.target;
            if (!target) continue;
            if (!hasWatchedParent(target)) {
                for (let i = 0; i < 4; i++) target = target.parent || target;
                const e = await detectAllElements(target)
                elements = elements.concat(e);
            }
        }
    });
    observer.observe(document.body, observerConfig);

    // Setup listener for messages from popup
    chrome.runtime.onMessage.addListener(async function (data, sender, senderResponse) {
        switch (data.type) {
            case 'getHref':
                senderResponse({success: true, data: Browser.instance.href});
                break;
            case 'getConversionCount':
                senderResponse({success: true, data: NaN});
                break;
            case 'setActiveLocalizations':
                await ActiveLocalization.instance.overload(data.data);
                Detector.instance.updateSharedLocalizations();
                elements.forEach(element => element.convertTo(currency));
                senderResponse({success: true})
                break;
            case 'getActiveLocalizations':
                senderResponse({success: true, data: ActiveLocalization.instance.compact});
                break;
        }
        return true;
    });
    timer.log('Started listeners for shortcut & new currencies...').reset();
    everything.log('Finished...');
});