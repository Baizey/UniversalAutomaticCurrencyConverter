const uaccWrapper = document.createElement('div');
uaccWrapper.setAttribute('id', 'uacc-window');
uaccWrapper.classList.add('uacc-window');
uaccWrapper.style.opacity = '1';

/**
 * @returns {CurrencyElement[]}
 */
const createElementsList = () => [];

const elements = createElementsList();

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
 * @returns {Promise<CurrencyElement[]>}
 */
async function detectAllNewElements() {
    const newElements = await detectAllElements(Browser.instance.document.body);
    newElements.forEach(e => elements.push(e));
    return newElements;
}

/**
 * @param {number} time
 * @returns {Promise<void>}
 */
async function detectAllNewElementsRecurring(time = 1000) {
    const timer = new Timer();
    timer.log(`Looking for currencies...`).reset();
    const newElements = await detectAllNewElements();
    time = newElements.length > 0 ? 1000 : time * 2;
    if (newElements.length > 0) timer.log(`Converted page, ${elements.length} conversions...`).reset();
    else timer.log(`Converted page, found no new elements to convert`).reset();
    if (time > 7 * 1000) return;
    timer.log(`Waiting ${(time / 1000).toFixed(2)} seconds before checking again`).reset();
    setTimeout(() => detectAllNewElementsRecurring(time), time);
}

/**
 * @param template
 * @param {boolean} asHtml
 * @returns {Promise<string|ChildNode>}
 */
async function createAlert(template, asHtml = true) {
    const browser = Browser.instance;
    const bodyColor = browser.window.getComputedStyle(browser.document.body, null).getPropertyValue('background-color');
    const rawColors = bodyColor.match(/\d+/g).map(e => Number(e));
    const reverseColors = rawColors.slice(0, 3).map(e => (e + 128) % 255);
    const colors = rawColors.map(e => e * 0.85);
    const inputColor = colors.length === 3
        ? 'rgb(' + colors.map(e => e * 1.1).join(',') + ')'
        : 'rgba(' + colors.map(e => e * 1.1).map(e => Math.max(e, .9)).join(',') + ')';
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
        .replace(/\${inputColor}/g, inputColor)
        .replace(/\${reverseBorderColor}/g, reverseBorderColor)
        .replace(/\${reverseBackgroundColor}/g, reverseBackgroundColor)
        .replace(/\${reverseTextColor}/g, reverseTextColor);
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

    const div = browser.document.createElement('div')
    div.innerHTML = html;
    const alert = div.children[0];
    uaccWrapper.insertBefore(alert, uaccWrapper.children[1]);
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

function htmlToElement(html) {
    const div = document.createElement('div')
    div.innerHTML = html;
    return div.firstChild;
}

async function main() {
    const html = (await createAlert('titleMenu'))
        .replace('${version}', Browser.extensionVersion)
        .replace('${creator}', Browser.author)
        .replace("${link}", Browser.reviewLink)
    uaccWrapper.appendChild(htmlToElement(html));
    document.body.appendChild(uaccWrapper);
    await Engine.instance.load();

    const browser = Browser.instance;
    const detector = Detector.instance;
    const config = Configuration.instance;
    const localization = ActiveLocalization.instance;
    const siteAllowance = SiteAllowance.instance;
    const shortcut = config.utility.shortcut.value;

    // Handle allowance by black/white listing
    if (!siteAllowance.isAllowed(browser.href).allowed)
        return console.log('UACC: Site is blacklisted, goodbye');

    // Detect localization for website
    const timer = new Timer();
    await localization.determineForSite(browser.document.body.innerText);
    await detector.updateSharedLocalizations();
    timer.log('Checked localization...').reset();

    // Convert currencies
    detectAllNewElementsRecurring().finally();

    // Create alert if needed
    timer.log('Creating localization alert (if needed)...').reset();
    await createLocalizationAlert();

    // Shortcut activation
    timer.log('Setting up shortcut listener...').reset();
    browser.window.addEventListener('keyup', e => {
        if (e.key !== shortcut) return;
        elements.filter(e => e.selected).forEach(e => e.flipDisplay());
    });

    // Update on changes and additions to site
    const observerConfig = {attributes: true, childList: true, subtree: true}
    const observer = new MutationObserver(async list => {
        await detectAllNewElements();
        elements.forEach(e => e.updateDisplay())
    });
    //observer.observe(browser.document.body, {childList: true, subtree: true, attributes: false, characterData: false});
    observer.observe(browser.document.body, {childList: true, subtree: false, attributes: false, characterData: true});
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
    if (browser.document.getElementById('uacc-select')) return;
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
        .replace('${conversionCount}', elements.length + '')
    const menu = htmlToElement(html);
    if (browser.document.getElementById('uacc-context')) return;
    uaccWrapper.insertBefore(menu, uaccWrapper.children[1]);

    // Site allowance
    if (allowance.isAllowed(browser.href).allowed)
        document.getElementById('uacc-context-whitelist').classList.add('uacc-button-ignore');
    else
        document.getElementById('uacc-context-blacklist').classList.add('uacc-button-ignore');

    // Conversion
    const currenctCurrency = document.getElementById('uacc-context-currency-options');
    currenctCurrency.addEventListener('change', async () => {
        const value = currenctCurrency.children[currenctCurrency.selectedIndex].value;
        // Update settings
        config.currency.tag.setValue(value);
        await config.currency.tag.save();
        // Re-calculate all conversions to new currency
        elements.forEach(element => element
            .convertTo(config.currency.tag.value)
            .then(() => element.updateDisplay(true)));
    });

    // Conversion
    document.getElementById('uacc-context-conversions-show').addEventListener('click', () => {
        elements.forEach(e => e.showConverted());
        document.getElementById('uacc-context-conversions-show').classList.add('uacc-button-ignore');
        document.getElementById('uacc-context-conversions-hide').classList.remove('uacc-button-ignore');
    });
    document.getElementById('uacc-context-conversions-hide').addEventListener('click', () => {
        elements.forEach(e => e.showOriginal())
        document.getElementById('uacc-context-conversions-show').classList.remove('uacc-button-ignore');
        document.getElementById('uacc-context-conversions-hide').classList.add('uacc-button-ignore');
    })
    document.getElementById('uacc-context-dismiss')
        .addEventListener('click', () => menu.remove());
    if (config.utility.using.value)
        document.getElementById('uacc-context-conversions-show').classList.add('uacc-button-ignore')
    else
        document.getElementById('uacc-context-conversions-hide').classList.add('uacc-button-ignore')

    // Black/white listing
    document.getElementById('uacc-context-whitelist').addEventListener('click', async () => {
        const value = document.getElementById('uacc-context-url').value;
        const url = `https://${value}`;
        const allowed = allowance.isAllowed(url).allowed;
        if (!allowed) {
            config.blacklist.urls.setValue(config.blacklist.urls.value.filter(e => e !== url));
            config.whitelist.urls.value.push(url);
            await config.blacklist.urls.save();
            await config.whitelist.urls.save();
            allowance.updateFromConfig();
        }
        document.getElementById('uacc-context-whitelist').classList.add('uacc-button-ignore');
        document.getElementById('uacc-context-blacklist').classList.remove('uacc-button-ignore');
    });
    document.getElementById('uacc-context-blacklist').addEventListener('click', async () => {
        const value = document.getElementById('uacc-context-url').value;
        const url = `https://${value}`;
        if (allowance.isAllowed(url).allowed) {
            config.whitelist.urls.setValue(config.whitelist.urls.value.filter(e => e !== url));
            config.blacklist.urls.value.push(url);
            await config.blacklist.urls.save();
            await config.whitelist.urls.save();
            allowance.updateFromConfig();
        }
        document.getElementById('uacc-context-whitelist').classList.remove('uacc-button-ignore');
        document.getElementById('uacc-context-blacklist').classList.add('uacc-button-ignore');
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