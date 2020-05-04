const uaccWrapper = document.createElement('div');
uaccWrapper.setAttribute('id', 'uacc-window');
uaccWrapper.classList.add('uacc-window');
uaccWrapper.style.opacity = '1';

/**
 * @param parent
 * @returns {Promise<CurrencyElement[]|*[]>}
 */
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
 * @param text
 * @param template
 * @returns {Promise<string>}
 */
async function createAlert(text, template = 'generalAlert') {
    const browser = Browser.instance;
    const bodyColor = browser.window.getComputedStyle(browser.document.body, null).getPropertyValue('background-color');
    const rawColors = bodyColor.match(/\d+/g).map(e => Number(e));
    const reverseColors = rawColors.slice(0, 3).map(e => (e + 128) % 255);
    const colors = rawColors.map(e => e * 0.85);
    const backgroundColor = colors.length === 3
        ? 'rgb(' + colors.join(',') + ')'
        : 'rgba(' + colors.map(e => Math.max(e, .9)).join(',') + ')';
    const borderColor = colors.length === 3
        ? 'rgb(' + colors.map(e => e * 0.85).join(',') + ')'
        : 'rgba(' + colors.map(e => e * 0.85).map(e => Math.max(e, .9)).join(',') + ')';
    const textColor = (colors.slice(0, 3).reduce((a, b) => a + b) / 3) >= 128 ? '#111' : '#eee';
    const reverseBorderColor = 'rgb(' + reverseColors.join(',') + ')';
    const reverseBackgroundColor = 'rgb(' + reverseColors.map(e => e * 0.85).join(',') + ')';
    const reverseTextColor = textColor === '#eee' ? '#111' : '#eee';
    const html = (await browser.background.getHtml(template))
        .replace(/\${backgroundColor}/g, backgroundColor)
        .replace(/\${borderColor}/g, borderColor)
        .replace(/\${textColor}/g, textColor)
        .replace(/\${reverseBorderColor}/g, reverseBorderColor)
        .replace(/\${reverseBackgroundColor}/g, reverseBackgroundColor)
        .replace(/\${reverseTextColor}/g, reverseTextColor)
        .replace('${content}', text);
    return html;
}


function hasWatchedParent(target) {
    if (!target) return false;
    if (!target.hasAttribute) return false;
    if (typeof target.hasAttribute !== 'function') return false;
    if (target.hasAttribute('uacc:watched')) return target.getAttribute('uacc:watched');
    return hasWatchedParent(target.parent);
}

async function createLocalizationAlert(elements) {
    const showAlert = Configuration.instance.alert.localization.value;
    const localization = ActiveLocalization.instance;
    if (!showAlert || !(await localization.hasConflict())) return;
    const browser = Browser.instance;
    const detector = Detector.instance;
    const content = [
        {detected: localization.krone, default: localization._defaultKrone},
        {detected: localization.yen, default: localization._defaultYen},
        {detected: localization.dollar, default: localization._defaultDollar},
    ].filter(e => e.default !== e.detected).map(e =>
        `<div style="text-align: center; width:100%; min-height: 15px">
<span style="width:50%; float: left">Detected ${e.detected}</span>
<span style="width:50%; float: left">Default's ${e.default}</span>
</div>`)
        .join('');

    const html = (await createAlert(content, 'localizationAlert'))
        .replace('${hostname}', browser.hostname)

    const div = browser.document.createElement('div')
    div.innerHTML = html;
    const alert = div.children[0];
    uaccWrapper.appendChild(alert);
    const removeAlert = (fast = false) => {
        console.log('removing alert')
        if (fast) alert.classList.add('uacc-fastRemove');
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 1000);
    };

    browser.document.getElementById('uacc-localization-dismiss').addEventListener('click', () => removeAlert(true));
    browser.document.getElementById('uacc-localization-save').addEventListener('click', async () => {
        console.log('locking alert')
        await localization.lockSite(true);
        removeAlert(true);
    });
    const detectedButton = browser.document.getElementById('uacc-localization-using-detected');
    const defaultsButton = browser.document.getElementById('uacc-localization-using-defaults');
    Utils.initializeRadioBoxes([detectedButton, defaultsButton]);
    const detected = localization.compact;
    detectedButton.addEventListener('change', async () => {
        console.log('change alert')
        await localization.overload(detected);
        detector.updateSharedLocalizations();
        await localization.save();
        elements.forEach(e => e.updateDisplay());
    });
    defaultsButton.addEventListener('change', async () => {
        await localization.reset();
        detector.updateSharedLocalizations();
        await localization.save();
        elements.forEach(e => e.updateDisplay());
    });
    const expire = Date.now() + 60000 * 20;
    const countdown = browser.document.getElementById('uacc-localization-countdown');
    const timer = setInterval(() => {
        console.log('countdown alert')
        const now = Date.now();
        if (now > expire) {
            clearInterval(timer);
            removeAlert();
            countdown.innerText = '0';
        } else
            countdown.innerText = Math.round((expire - now) / 1000) + '';
    }, 1000);
    alert.style.opacity = '1';
}

/**
 * @param {number} time
 * @param {Timer} timer
 * @returns {Promise<CurrencyElement[]>}
 */
async function convertOrTryAgain(time, timer) {
    if (time > 5000) return [];
    await Utils.wait(time);
    timer.reset();
    const elements = await detectAllElements(Browser.instance.document.body);
    if (elements.length === 0)
        return await convertOrTryAgain(time * 2, timer);
    return elements;
}

async function displayOrTryAgain(time = 500, elements) {
    if (time > 5000) return [];
    await Utils.wait(time);
    elements.forEach(e => e.updateDisplay());
    await displayOrTryAgain(time * 2, elements);
}

/**
 * @returns {Promise<CurrencyElement[]>}
 */
async function main() {
    document.body.appendChild(uaccWrapper);
    await Engine.instance.load();
    const browser = Browser.instance;
    const detector = Detector.instance;
    const config = Configuration.instance;
    const localization = ActiveLocalization.instance;
    const siteAllowance = SiteAllowance.instance;
    const shortcut = config.utility.shortcut.value;

    // Handle allowance by black/white listing
    if (!siteAllowance.isAllowed(browser.href)) {
        console.log('UACC: Site is blacklisted, goodbye');
        return [];
    }

    // Detect localization for website
    const timer = new Timer();
    await localization.determineForSite(browser.document.body.innerText);
    await detector.updateSharedLocalizations();
    timer.log('Checked localization...').reset();

    // Convert currencies
    let elements = await detectAllElements(browser.document.body);
    if (elements.length === 0)
        elements = await convertOrTryAgain(500, timer);

    timer.log(`Converted page, ${elements.length} conversions...`).reset();

    // Create alert if needed
    await createLocalizationAlert(elements);

    // Shortcut activation
    browser.window.addEventListener('keyup', e => {
        if (e.key !== shortcut) return;
        elements.filter(e => e.selected).forEach(e => e.flipDisplay());
    });

    // Update on changes and additions to site
    const observerConfig = {attributes: true, childList: true, subtree: true}
    const observer = new MutationObserver(async list => {
        console.log(list);
        for (let data of list) {
            const targets = [data.target];
            for (let i = 0; i < data.addedNodes.length; i++)
                targets.push(data.addedNodes[i]);
            for (let target of targets) {
                if (!target) continue;
                const watched = hasWatchedParent(target);
                console.log(target);
                console.log(watched);
                if (watched) {
                    const watcher = elements.filter(e => e.id === watched - 0)[0];
                    if (watcher) await watcher.updateDisplay();
                    return;
                }
                for (let i = 0; i < 4; i++) target = target.parent || target;
                const e = await detectAllElements(target);
                elements = elements.concat(e);
            }
        }
    });
    //observer.observe(browser.document.body, {childList: true, subtree: true, attributes: false, characterData: false});
    observer.observe(browser.document.body, {childList: true, subtree: false, attributes: false, characterData: true});
    // Setup listener for messages from popup
    timer.log('Started listeners for shortcut & new currencies...').reset();
    return elements;
}

async function showContextMenu(elements) {
    const browser = Browser.instance;
    const html = (await createAlert('', 'contextMenu'))
        .replace('${hostname}', browser.hostname);
    const div = browser.document.createElement('div')
    div.innerHTML = html;
    const menu = div.children[0];
    menu.style.opacity = '1';

    let selectedText = '';
    const currency = Configuration.instance.currency.tag.value;
    let paused = {value: false};
    const interval = setInterval(async function () {
        const filler = document.getElementById('uacc-context-selected');
        if (!filler) return clearInterval(interval);
        if (paused.value) return;
        const text = window.getSelection().toString().trim();
        if (!text || text === selectedText) return;
        selectedText = text;
        filler.value = text;
        const amounts = await Detector.instance.detectResult(text).then(e => e.map(e => e.amount));
        const result = [];
        for (let e of amounts)
            result.push(`${e.amount} ${e.tag} ⇒ ${(await e.convertTo(currency)).toString()}`);
        const resultDiv = document.getElementById('uacc-context-selected-conversions');
        if (!resultDiv) return clearInterval(interval);
        resultDiv.innerHTML = `<h3>Currencies found in selection</h3>${result.join('<br>')}`;
    }, 1000);

    if (browser.document.getElementById('uacc-context')) return;
    uaccWrapper.appendChild(menu);
    document.getElementById('uacc-context-pause').addEventListener('change', e => {
        paused.value = !document.getElementById('uacc-context-pause').checked
    })
    document.getElementById('uacc-context-show').addEventListener('click', () => elements.forEach(e => e.showConverted()))
    document.getElementById('uacc-context-hide').addEventListener('click', () => elements.forEach(e => e.showOriginal()))
    document.getElementById('uacc-context-dismiss').addEventListener('click', () => {
        clearInterval(interval);
        menu.remove();
    })

}

main().then(async elements => {
    chrome.runtime.onMessage.addListener(async function (data, sender, senderResponse) {
        switch (data.type) {
            case 'contextMenu':
                await showContextMenu(elements);
                senderResponse({success: true});
                break;
            case 'showConversions':
                elements.forEach(e => e.showConverted());
                senderResponse({success: true});
                break;
            case 'hideConversions':
                elements.forEach(e => e.showOriginal());
                senderResponse({success: true});
                break;
            case 'getHref':
                senderResponse({success: true, data: Browser.instance.href});
                break;
            case 'setActiveLocalization':
                await ActiveLocalization.instance.lockSite(false);
                await ActiveLocalization.instance.overload(data.data);
                Detector.instance.updateSharedLocalizations();
                elements.forEach(element => element.convert().then(() => element.updateDisplay()));
                await ActiveLocalization.instance.save();
                senderResponse({success: true})
                break;
            default:
                senderResponse({success: false, data: `${data.type} did not match anything`})
        }
        return true;
    });
}).catch(e => console.error(e));