let blacklisted = false;
const uaccWrapper = document.createElement('UaccDiv');
uaccWrapper.id = 'uacc-window';
uaccWrapper.classList.add('uacc-window');
uaccWrapper.setAttribute('uacc:watched', 'true');

/**
 * Just here for IDE context
 * @returns {CurrencyElement[]}
 */
const createElementsList = () => [];
const elements = createElementsList();

/**
 * @param parent
 * @returns {Promise<CurrencyElement[]>}
 */
async function detectAllElements(parent) {
    const currency = Configuration.instance.currency.tag.value;
    const autoConvert = Configuration.instance.utility.using.value;
    const newElements = (await Detector.instance.detectAllElements(parent)) || [];
    for (let element of newElements) {
        await element.convertTo(currency);
        await element.setupListener();
        if (autoConvert) {
            await element.showConverted();
            element.highlight();
        }
    }
    newElements.forEach(e => elements.push(e));
    return newElements;
}

/**
 * @returns {Promise<CurrencyElement[]>}
 */
async function detectAllNewElements() {
    const timer = new Timer();
    const newElements = await detectAllElements(document.body);
    if (newElements.length > 0)
        timer.log(`Converted page, ${newElements.length} conversions...`).reset();
    else
        timer.log(`Converted page, found no new elements to convert`).reset();
    return newElements;
}

/**
 * @param {number} time
 * @returns {Promise<void>}
 */
async function detectAllNewElementsRecurring(time = 1000) {
    const newElements = await detectAllNewElements();
    time = newElements.length > 0 ? 1000 : time * 2;
    if (time > 8 * 1000) return Utils.log(`Done auto-checking for currencies`);
    setTimeout(() => detectAllNewElementsRecurring(time), time);
}

/**
 * @param template
 * @param {boolean} asHtml
 * @returns {Promise<string|ChildNode>}
 */
async function createAlert(template, asHtml = true) {
    const browser = Browser.instance;
    const bodyColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
    const colors = bodyColor.match(/\d+/g).slice(0, 3).map(Number);
    const isLight = (colors.reduce((a, b) => a + b) / 3) >= 128

    const theme = isLight ? 'uacc-light-theme' : 'uacc-dark-theme';
    const opposite = !isLight ? 'uacc-light-theme' : 'uacc-dark-theme';
    const title = isLight ? 'uacc-light-title' : 'uacc-dark-title';
    const dropdown = isLight ? 'uacc-light-dropdown' : 'uacc-dark-dropdown';

    const html = (await browser.background.getHtml(template))
        .replace(/\${theme}/g, theme)
        .replace(/\${title-theme}/g, title)
        .replace(/\${dropdown-theme}/g, dropdown)
        .replace(/\${check-theme}/g, opposite)

    return asHtml ? html : htmlToElement(html);
}

async function createLocalizationAlert() {
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

    const html = (await createAlert('localizationAlert'))
        .replace('${hostname}', browser.hostname)
        .replace('${content}', content);

    const div = document.createElement('div')
    div.innerHTML = html;
    const alert = div.children[0];
    uaccWrapper.insertBefore(alert, uaccWrapper.children[1]);
    const removeAlert = (fast = false) => {
        if (fast) alert.classList.add('uacc-fastRemove');
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 1000);
    };

    document.getElementById('uacc-localization-dismiss').addEventListener('click', () => removeAlert(true));
    document.getElementById('uacc-localization-save').addEventListener('click', async () => {
        await localization.lockSite(true);
        removeAlert(true);
    });
    const detectedButton = document.getElementById('uacc-localization-using-detected');
    const defaultsButton = document.getElementById('uacc-localization-using-defaults');
    Utils.initializeRadioBoxes([detectedButton, defaultsButton]);
    const detected = localization.compact;
    detectedButton.addEventListener('change', async () => {
        await localization.overload(detected);
        detector.updateSharedLocalizations();
        await localization.save();
        elements.forEach(e => e.updateDisplay());
        await localization.lockSite(false);
    });
    defaultsButton.addEventListener('change', async () => {
        await localization.reset();
        detector.updateSharedLocalizations();
        await localization.save();
        elements.forEach(e => e.updateDisplay(true));
        await localization.lockSite(false);
    });
    const expire = Date.now() + 60000;
    const countdown = document.getElementById('uacc-localization-countdown');
    const timer = setInterval(() => {
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

function htmlToElement(html) {
    const div = document.createElement('div')
    div.innerHTML = html;
    return div.firstChild;
}

async function convertSelected(text, currency) {
    const amounts = await Detector.instance.detectResult(text).then(e => e.map(e => e.amount));
    const result = [];
    for (let e of amounts)
        result.push(`${e.amount} ${e.tag} ⇒ ${(await e.convertTo(currency)).toString()}`);
    const resultDiv = document.getElementById('uacc-select-conversions');
    if (!resultDiv) return;
    resultDiv.innerHTML = `<div class="uacc-subheader uacc-center">Currencies found in selection</div>${result.join('<br>')}`;
}

async function showSelectMenu() {
    const browser = Browser.instance;
    const menu = await createAlert('selectedMenu', false);

    let selectedText = '';
    const currency = Configuration.instance.currency.tag.value;
    let paused = {value: false};
    if (document.getElementById('uacc-select')) return;
    uaccWrapper.insertBefore(menu, uaccWrapper.children[1]);

    const filler = document.getElementById('uacc-select-selected');
    filler.addEventListener('change', async () => {
        const text = filler.value;
        if (!text || text === selectedText) return;
        selectedText = text;
        await convertSelected(text, currency);
    });

    const text = window.getSelection().toString().trim();
    selectedText = text;
    filler.value = text;
    await convertSelected(text, currency);

    const interval = setInterval(async function () {
        if (paused.value) return;
        const text = window.getSelection().toString().trim();
        if (!text || text === selectedText) return;
        selectedText = text;
        filler.value = text;
        await convertSelected(text, currency);
    }, 1000);

    document.getElementById('uacc-select-pause').addEventListener('change', e => {
        paused.value = !document.getElementById('uacc-select-pause').checked
    })
    document.getElementById('uacc-select-dismiss').addEventListener('click', () => {
        clearInterval(interval);
        menu.remove();
    })
}

async function showContextMenu() {
    const allowance = SiteAllowance.instance;
    const config = Configuration.instance;
    const browser = Browser.instance;
    const symbols = await Currencies.instance.symbols();
    const selectedCurrency = config.currency.tag.value;
    const currenciesDropdown = Object.keys(symbols).sort()
        .map(tag => `<option ${selectedCurrency === tag ? 'selected' : ''} value="${tag}">${symbols ? `${tag} (${symbols[tag]})` : tag}</option>`)
        .join('');

    const html = (await createAlert('contextMenu'))
        .replace('${hostname}', browser.hostAndPath)
        .replace('${currencies}', currenciesDropdown)
        .replace('${conversionCount}', blacklisted ? 'Site is blacklisted' : `${elements.length} conversions`)
    const menu = htmlToElement(html);
    if (document.getElementById('uacc-context')) return;
    uaccWrapper.insertBefore(menu, uaccWrapper.children[1]);

    const blacklistButton = document.getElementById('uacc-context-blacklist');
    const whitelistButton = document.getElementById('uacc-context-whitelist');
    const urlInput = document.getElementById('uacc-context-url');

    const conversionShowButton = document.getElementById('uacc-context-conversions-show');
    const conversionHideButton = document.getElementById('uacc-context-conversions-hide');

    // Context based displays
    // Allowance
    if (!config.blacklist.using.value && !config.whitelist.using.value) document.getElementById('uacc-context-allowance').style.display = 'none';
    if (allowance.isAllowed(browser.href).allowed) whitelistButton.style.display = 'none';
    else blacklistButton.style.display = 'none';

    // Conversion
    if (elements.length === 0) document.getElementById('uacc-context-conversions-buttons').style.display = 'none';
    if (config.utility.using.value) conversionShowButton.classList.add('uacc-button-ignore')
    else conversionHideButton.classList.add('uacc-button-ignore')

    // Convert to
    const currencyOptions = document.getElementById('uacc-context-currency-options');
    currencyOptions.addEventListener('change', async () => {
        const value = currencyOptions.children[currencyOptions.selectedIndex].value;
        // Update settings
        config.currency.tag.setValue(value);
        await config.currency.tag.save();
        // Re-calculate all conversions to new currency
        elements.forEach(element => element
            .convertTo(config.currency.tag.value)
            .then(() => element.updateDisplay(true)));
    });

    // Conversion
    conversionShowButton.addEventListener('click', () => {
        elements.forEach(e => e.showConverted());
        document.getElementById('uacc-context-conversions-show').classList.add('uacc-button-ignore');
        document.getElementById('uacc-context-conversions-hide').classList.remove('uacc-button-ignore');
    });
    conversionHideButton.addEventListener('click', () => {
        elements.forEach(e => e.showOriginal())
        document.getElementById('uacc-context-conversions-show').classList.remove('uacc-button-ignore');
        document.getElementById('uacc-context-conversions-hide').classList.add('uacc-button-ignore');
    });

    // Dismiss button
    document.getElementById('uacc-context-dismiss').addEventListener('click', () => menu.remove());

    urlInput.addEventListener('change', () => {
        const url = `https://${urlInput.value}`;
        if (allowance.isAllowed(url).allowed) {
            whitelistButton.style.display = 'none';
            blacklistButton.style.display = '';
        } else {
            whitelistButton.style.display = '';
            blacklistButton.style.display = 'none';
        }
    })
    // Black/white listing
    whitelistButton.addEventListener('click', async () => {
        const url = `https://${urlInput.value}`;
        if (!allowance.isAllowed(url).allowed) {
            config.blacklist.urls.setValue(config.blacklist.urls.value.filter(e => e !== url));
            config.whitelist.urls.value.push(url);
            await config.blacklist.urls.save();
            await config.whitelist.urls.save();
            allowance.updateFromConfig();
        }
        whitelistButton.style.display = 'none';
        blacklistButton.style.display = '';
    });
    blacklistButton.addEventListener('click', async () => {
        const url = `https://${urlInput.value}`;
        if (allowance.isAllowed(url).allowed) {
            config.whitelist.urls.setValue(config.whitelist.urls.value.filter(e => e !== url));
            config.blacklist.urls.value.push(url);
            await config.blacklist.urls.save();
            await config.whitelist.urls.save();
            allowance.updateFromConfig();
        }
        whitelistButton.style.display = '';
        blacklistButton.style.display = 'none';
    })

    // Localization
    const localization = ActiveLocalization.instance;
    const detector = Detector.instance;
    document.getElementById('uacc-context-localization-krone').value = localization.krone;
    document.getElementById('uacc-context-localization-yen').value = localization.yen;
    document.getElementById('uacc-context-localization-dollar').value = localization.dollar;
    ['krone', 'yen', 'dollar'].forEach(name => {
        const element = document.getElementById(`uacc-context-localization-${name}`);
        if (!element) return;
        element.addEventListener('change', async () => {
            const update = {[name]: element.children[element.selectedIndex].value}
            await localization.overload(update);
            await localization.lockSite(false);
            await localization.save();
            detector.updateSharedLocalizations();
            elements.forEach(element => element.convert().then(() => element.updateDisplay(true)));
        });
    })
}

function childOfUACCWatched(element) {
    if (!element || element.hasAttribute('uacc:watched'))
        return true;
    if (!element.parentElement)
        return false;
    return childOfUACCWatched(element.parentElement);
}

async function main() {
    const html = (await createAlert('titleMenu'))
        .replace('${version}', Browser.instance.extensionVersion)
        .replace('${creator}', Browser.instance.author)
        .replace("${link}", Browser.instance.reviewLink)
    document.body.appendChild(uaccWrapper);
    uaccWrapper.appendChild(htmlToElement(html));

    await Engine.instance.load();

    const browser = Browser.instance;
    const detector = Detector.instance;
    const config = Configuration.instance;
    const localization = ActiveLocalization.instance;
    const siteAllowance = SiteAllowance.instance;
    const shortcut = config.utility.shortcut.value;

    // Handle allowance by black/white listing
    if (!siteAllowance.isAllowed(browser.href).allowed) {
        Utils.log('Site is blacklisted, goodbye');
        blacklisted = true;
        return;
    }

    // Detect localization for website
    const timer = new Timer();
    await localization.determineForSite(document.body.innerText);
    await detector.updateSharedLocalizations();
    timer.log('Checked localization...').reset();

    // Convert currencies
    detectAllNewElementsRecurring().finally();

    // Create alert if needed
    await createLocalizationAlert();

    // Shortcut activation
    window.addEventListener('keyup', e => {
        if (e.key !== shortcut) return;
        elements.filter(e => e.selected).forEach(e => e.flipDisplay());
    });

    new MutationObserver(async mutations => {
        for (const mutation of mutations)
            for (const node of mutation.addedNodes) {
                const element = node.parentElement;
                if (childOfUACCWatched(element))
                    continue;
                await detectAllElements(element);
            }
    }).observe(document.body, {childList: true, subtree: true, attributes: true, characterData: true});
}

main().then(async () => {
    chrome.runtime.onMessage.addListener(async function (data, sender, senderResponse) {
        switch (data.type) {
            case 'changeCurrency':
                senderResponse({success: false, data: 'not implemented'});
                break;
            case 'selectedMenu':
                await showSelectMenu();
                senderResponse({success: true});
                break;
            case 'contextMenu':
                await showContextMenu();
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
                senderResponse({success: false, data: `${data.type} did not match anything`});
                break;
        }
        return true;
    });
}).catch(e => console.error(e));