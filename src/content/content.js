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


function hasWatchedParent(target) {
    if (!target) return false;
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
        `<div style="text-align: center" class="uacc-line">
    <span style="width:50%; float: left">Detected ${e.detected}</span>
    <span style="width:50%; float: left">Default's ${e.default}</span>
</div>`).join('');

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
    const html = `<div class="uacc-alertWrapper" style="background-color:${backgroundColor}; color: ${textColor}; border: 1px solid ${borderColor}">
    <span class="uacc-line" style="font-size: 10px; margin-bottom: 0; padding-bottom: 0">Universal Automatic Currency Converter</span>
    <h2 class="uacc-line" style="margin-top: 0; padding-top: 0">${browser.hostname}</h2>
    <div class="uacc-line">${content}</div>
    
    <div class="uacc-line" style="height:55px">
        <div style="width:50%; float: left">
            <label class="uacc-center" style="font-weight: bold" for="uacc-using-detected">Use detected</label>
            <div style="margin:auto; background-color: ${reverseBackgroundColor}; border-color: ${reverseBorderColor}" class="uacc-radiobox checked" id="uacc-using-detected">
                <div></div>
            </div>
        </div>
        <div style="width:50%; float: left">
            <label class="uacc-center" style="font-weight: bold" for="uacc-using-defaults">Use defaults</label>
            <div style="margin:auto; background-color: ${reverseBackgroundColor}; border-color: ${reverseBorderColor}" class="uacc-radiobox" id="uacc-using-defaults">
                <div></div>
            </div>
        </div>
    </div>
    <div class="uacc-saveAndDismissLocalizationButton" id="uacc-save">Save as site defaults and dont ask again</div>
    <div class="uacc-dismissLocalizationButton" id="uacc-dismiss">Dismiss alert</div>
    <p class="uacc-line" style="font-size:12px;">You can always change site specific localization in the mini-converter popup</p>
    <p class="uacc-line" style="font-size:12px;">This alert self destructs in <span id="uacc-countdown">60</span> seconds</p>
</div>`;
    const div = browser.document.createElement('div')
    div.innerHTML = html;
    const alert = div.children[0];
    browser.document.body.appendChild(alert);
    const removeAlert = (fast = false) => {
        if (fast) alert.classList.add('uacc-fastRemove');
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 1000);
    };

    browser.document.getElementById('uacc-dismiss')
        .addEventListener('click', () => removeAlert(true));
    browser.document.getElementById('uacc-save').addEventListener('click', async () => {
        await localization.lockSite(true);
        removeAlert(true);
    });
    const detectedButton = browser.document.getElementById('uacc-using-detected');
    const defaultsButton = browser.document.getElementById('uacc-using-defaults');
    Utils.initializeRadioBoxes([detectedButton, defaultsButton]);
    const detected = localization.compact;
    detectedButton.addEventListener('change', async () => {
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
    const expire = Date.now() + 60000;
    const countdown = browser.document.getElementById('uacc-countdown');
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

/**
 * @param {number} time
 * @param {Timer} timer
 * @returns {Promise<CurrencyElement[]>}
 */
async function convertOrTryAgain(time = 500, timer) {
    if (time > 5000) return [];
    await Utils.wait(time);
    timer.reset();
    const elements = await detectAllElements(Browser.instance.document.body);
    if (elements.length === 0)
        return await convertOrTryAgain(time * 2, timer);
    return elements;
}

async function main() {
    await Engine.instance.load();
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
    await localization.determineForSite(browser.document.body.innerText);
    await detector.updateSharedLocalizations();
    timer.log('Checked localization...').reset();

    // Convert currencies
    let elements = await convertOrTryAgain(1000, timer);
    timer.log(`Converted page, ${elements.length} conversions...`).reset();

    // Shortcut activation
    browser.window.addEventListener('keyup', e => {
        if (e.key !== shortcut) return;
        // TODO: Maybe optimize? this could be costly on sites with a lot of conversions
        elements.filter(e => e.selected).forEach(e => e.flipDisplay());
    });

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
    observer.observe(browser.document.body, observerConfig);

    await createLocalizationAlert(elements);

    // Setup listener for messages from popup
    chrome.runtime.onMessage.addListener(async function (data, sender, senderResponse) {
        switch (data.type) {
            case 'getHref':
                senderResponse({success: true, data: Browser.instance.href});
                break;
            case 'getConversionCount':
                senderResponse({success: true, data: elements.length});
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
}

main().catch(e => console.error(e));