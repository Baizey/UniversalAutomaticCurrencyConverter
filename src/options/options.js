const engine = new Engine();

const Ids = {
    'currency': 'currency',
    'currencyLastUpdate': 'currencyLastUpdate',
};

/**
 * @returns {Promise<string>}
 */
const updateCurrencyLists = async () => {
    const symbols = (await Browser.httpGet('symbols')).symbols;
    document.getElementById(Ids.currency).innerHTML = Object.keys(symbols)
        .sort()
        .map(tag => `<option value="${tag}">${symbols ? `${tag} (${symbols[tag]})` : tag}</option>`)
        .join('');
};

const createListField = (wrapper, value = '') => {
    const element = document.createElement(`input`);
    element.classList.add('url', 'form-control');
    element.placeholder = 'https://...';
    element.style.borderRadius = '0';
    element.value = value;
    element.addEventListener('change', () => updateLists());
    wrapper.appendChild(element);
};

const updateListChildren = (wrapper) => {
    const children = wrapper.children;
    const urls = [];
    for (let i = 0; i < children.length; i++)
        if (children[i].value) urls.push(children[i].value);
        else wrapper.removeChild(children[i--]);
    createListField(wrapper);
    return urls;
};

const updateLists = () => {
    // Update whitelist
    const whitelistWrapper = document.getElementById('currencyWhitelistUrls');
    if (whitelistWrapper.children.length === 0) {
        engine.whitelist.urls.forEach(url => createListField(whitelistWrapper, url));
        createListField(whitelistWrapper);
    } else {
        const urls = updateListChildren(whitelistWrapper);
        engine.whitelist.withUrls(urls);
        Browser.save('whitelistingurls', engine.whitelist.urls).catch();
    }

    // Update blacklist
    const blacklistWrapper = document.getElementById('currencyBlacklistUrls');
    if (blacklistWrapper.children.length === 0) {
        engine.blacklist.urls.forEach(url => createListField(blacklistWrapper, url));
        createListField(blacklistWrapper);
    } else {
        const urls = updateListChildren(blacklistWrapper);
        engine.blacklist.withUrls(urls);
        Browser.save('blacklistingurls', engine.blacklist.urls).catch();
    }
};

const updateExamples = () => {
    const formatter = engine.numberFormatter;
    const converter = engine.currencyConverter;
    const formattingExample = 123456.78;
    const conversionExample = 100;
    const formattingDiv = document.getElementById('formattingExample');
    if (formattingDiv) formattingDiv.value = formatter.format(formatter.round(formattingExample));

    const displayExample = document.getElementById('displayExample');
    if (displayExample) displayExample.value = engine.transform(conversionExample, converter.baseCurrency);
};

let lastHighLight = Date.now();
const updateHighlightExample = () => {
    if (Date.now() <= lastHighLight + 1000)
        return;
    lastHighLight = Date.now();
    engine.elementTransformer
        .highlightConversion(document.getElementById('highlightExample'))
        .catch();
};

const initiateCustomElements = () => {
    Utils.getByClass('checkbox')
        .filter(e => Utils.isUndefined(e.checked))
        .forEach(box => {
            box.checked = box.classList.contains('checked');
            const check = () => {
                box.checked = true;
                box.classList.add('checked');
            };
            const uncheck = () => {
                box.checked = false;
                box.classList.remove('checked');
            };
            box.change = (value = !box.checked) => value ? check() : uncheck();
            box.addEventListener('click', () => {
                box.change();
                box.dispatchEvent(new Event('change'));
            });
        });

    let mouseIsOver = null;
    let element = document.getElementById('currencyShortcut');
    element.addEventListener('mouseout', () => mouseIsOver = null);
    element.addEventListener('mouseover', () => mouseIsOver = element);
    window.addEventListener("keydown", e => {
        if (mouseIsOver) {
            mouseIsOver.value = e.key;
            const evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            mouseIsOver.dispatchEvent(evt);
        }
    }, false);
};

const getUiValue = key => {
    const element = document.getElementById(key);
    switch (key) {
        case 'currencyCustomTag':
            let originalValue = element.value;
            const value = originalValue.indexOf('¤') < 0 ? '¤ ' + originalValue : originalValue;
            element.value = value;
            return value;

        // Input field
        case 'currencyHighlightColor':
        case 'currencyHighlightDuration':
        case 'currencyConversionAmount':
        case 'currencyShortcut':
        case 'decimalAmount':
        case 'currencyCustomTagValue':
            return element.value;

        // Checkbox
        case 'showNonDefaultCurrencyAlert':
        case 'currencyUsingAutomatic':
        case 'currencyUsingHighlight':
        case 'currencyUsingCustomTag':
        case 'intelligentRounding':
            return element.checked;

        // Selector
        case 'currency':
            return element.children[element.selectedIndex].value || 'EUR';
        // Selector
        case 'usingBlacklist':
        case 'currencyLocalizationDollar':
        case 'currencyLocalizationAsian':
        case 'currencyLocalizationKroner':
        case 'thousandDisplay':
        case 'decimalDisplay':
            return element.children[element.selectedIndex].value;
    }
};

const setUiValue = async (key, value) => {
    const element = document.getElementById(key);
    switch (key) {

        case 'showNonDefaultCurrencyAlert':
            engine.withShowNonDefaultCurrencyAlert(value);
            element.change(engine.showNonDefaultCurrencyAlert);
            break;

        case 'currencyLocalizationDollar':
        case 'currencyLocalizationKroner':
        case 'currencyLocalizationAsian':
            engine.localization.site.setDefaultLocalization(value);
            element.value = engine.getById(key);
            break;
        case 'currencyUsingAutomatic':
            engine.shouldAutoconvert(value);
            element.change(engine.automaticPageConversion);
            break;
        case 'usingBlacklist':
            if (value === true) value = 'blacklist';
            else if (value === false) value = 'none';
            engine.blacklist.using(value);
            engine.whitelist.using(value);
            const result =
                engine.blacklist.isEnabled
                    ? 'blacklist'
                    : (engine.whitelist.isEnabled ? 'whitelist' : 'none');
            element.value = result;
            break;

        case 'currencyHighlightColor':
            engine.highlighter.withColor(value);
            element.value = engine.highlighter.color;
            updateHighlightExample();
            break;
        case 'currencyHighlightDuration':
            engine.highlighter.withDuration(value);
            element.value = engine.highlighter.duration;
            updateHighlightExample();
            break;
        case 'currencyUsingHighlight':
            engine.highlighter.using(value);
            element.change(engine.highlighter.isEnabled);
            updateHighlightExample();
            break;
        case 'currency':
            engine.currencyConverter.withBaseCurrency(value);
            element.value = engine.currencyConverter.baseCurrency;
            updateExamples();
            break;
        case 'currencyShortcut':
            engine.withCurrencyShortcut(value);
            element.value = engine.conversionShortcut;
            break;
        case 'currencyCustomTagValue':
            engine.customTag.withValue(value);
            element.value = engine.customTag.value;
            updateExamples();
            break;
        case 'currencyCustomTag':
            engine.customTag.withTag(value);
            element.value = engine.customTag.tag;
            updateExamples();
            break;
        case 'currencyUsingCustomTag':
            engine.customTag.using(value);
            element.change(engine.customTag.enabled);
            updateExamples();
            break;
        case 'thousandDisplay':
            engine.numberFormatter.withThousand(value);
            element.value = engine.numberFormatter.thousand;
            updateExamples();
            break;
        case 'decimalDisplay':
            engine.numberFormatter.withDecimal(value);
            element.value = engine.numberFormatter.decimal;
            updateExamples();
            break;
        case 'decimalAmount':
            engine.numberFormatter.withRounding(Math.round(value));
            element.value = engine.numberFormatter.rounding;
            updateExamples();
            break;
        default:
            throw 'Unknown element';
    }
};


document.addEventListener("DOMContentLoaded", async function () {
    // Initiate UI elements
    initiateCustomElements();
    Browser.updateFooter();
    await updateCurrencyLists();

    // Load engine data
    await engine.getConversionRates();
    await engine.loadSettings();
    await setUiValue(Ids.currency, engine.currencyConverter.baseCurrency);
    document.getElementById(Ids.currencyLastUpdate).innerText = engine.lastCurrencyUpdate;

    // Blacklist fields
    updateLists();

    // Normal fields
    for (const id of Utils.storageIds()) {
        if (Utils.manualStorageIds()[id])
            continue;
        const value = engine.getById(id);
        const element = document.getElementById(id);

        await setUiValue(id, value);

        element.addEventListener('focus', () => element.style.border = '1px solid #f0ad4e');
        element.addEventListener('focusout', () => element.style.border = '');

        element.addEventListener('change', async function () {
            const oldValue = getUiValue(id);
            await setUiValue(id, oldValue);
            const newValue = getUiValue(id);

            if (newValue !== oldValue)
                document.getElementById(id).style.border = '1px solid red';
            else
                Browser.save(id, oldValue).then(() => document.getElementById(id).style.border = '1px solid green');
        });
    }

    // Newly installed banner
    const isFirstTime = await Browser.load(Utils.storageIds()).then(r => Object.keys(r).length === 0);
    const options = document.getElementById('options-wrapper');
    if (isFirstTime) {
        const progressBarBlue = document.getElementById('firsttime-progress-blue');
        const progressBarGreen = document.getElementById('firsttime-progress-green');
        options.classList.add('hidden');
        document.getElementById('firstime-overlay').classList.remove('hidden');
        document.getElementById('firsttime-title').append(options.children[0]);

        const todo = options.children.length;

        const done = document.getElementById('firsttime-button-done');
        done.addEventListener('click', () => done.classList.contains('disabled') || location.reload());

        const wrapper = document.getElementById('firsttime-wrapper');
        const next = document.getElementById('firsttime-button-next');
        next.addEventListener('click', () => {
            if (next.classList.contains('disabled')) return;
            wrapper.children[0].classList.add('fadeout');
            wrapper.children[0].style.opacity = '0';
            const progress = Math.round((1 - (options.children.length - 1) / todo) * 100);
            progressBarBlue.style.width = progress >= 100 ? '0%' : Math.min(50, progress) + '%';
            progressBarGreen.style.width = progress >= 100 ? '100%' : Math.max(progress - 50, 0) + '%';
            setTimeout(() => {
                wrapper.children[0].remove();
                options.children[0].classList.add('firsttimeFadein');
                options.children[0].classList.add('fadein');
                wrapper.append(options.children[0]);
                if (options.children.length === 0) {
                    next.remove();
                    done.style.width = '100%';
                }
            }, 250);
        });
        document.getElementById('currency').addEventListener('click', () => {
            document.getElementById('firsttime-currency').classList.add('hidden');
            next.classList.remove('disabled');
            done.classList.remove('disabled');
        });
        options.children[0].classList.add('firsttimeFadein');
        options.children[0].classList.add('fadein');
        wrapper.append(options.children[0]);
        const progress = Math.round((1 - (options.children.length) / todo) * 100);
        progressBarBlue.style.width = progress >= 100 ? '0%' : Math.min(50, progress) + '%';
        progressBarGreen.style.width = progress >= 100 ? '100%' : Math.max(progress - 50, 0) + '%';
    }
});