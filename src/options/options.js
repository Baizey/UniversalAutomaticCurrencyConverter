const Ids = {
    'currency': 'currency',
    'currencyLastUpdate': 'currencyLastUpdate',
};

/**
 * @returns {Promise<string>}
 */
const updateCurrencyLists = async () => {
    const symbols = await Currencies.instance.symbols();
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
    for (let i = 0; i < children.length; i++) {
        if (children[i].value) {
            if (!children[i].value.startsWith('http://') && !children[i].value.startsWith('https://'))
                children[i].value = `https://${children[i].value}`;
            const value = children[i].value;
            const url = new URL(value);
            urls.push(url.href);
        } else
            wrapper.removeChild(children[i--]);
    }
    createListField(wrapper);
    return urls;
};

const updateLists = () => {
    const config = Configuration.instance;
    // Update whitelist
    const whitelistWrapper = document.getElementById('currencyWhitelistUrls');
    const blacklistWrapper = document.getElementById('currencyBlacklistUrls');
    const blacklist = config.blacklist;
    const whitelist = config.whitelist;
    const updateList = (wrapper, list) => {
        if (wrapper.children.length === 0) {
            list.urls.value.forEach(url => createListField(wrapper, url));
            createListField(wrapper);
        } else {
            const urls = updateListChildren(wrapper);
            list.urls.setValue(urls);
            list.urls.save().catch();
        }
    }
    updateList(whitelistWrapper, whitelist);
    updateList(blacklistWrapper, blacklist);
};

const updateExamples = () => {
    const tag = Configuration.instance.currency.tag.value;

    const formatConfig = new Configuration();
    formatConfig.display = Configuration.instance.display;
    formatConfig.currency = Configuration.instance.currency;
    const formatExample = new CurrencyAmount(tag, 123456.78, {config: formatConfig});

    const formattingDiv = document.getElementById('formattingExample');
    if (formattingDiv) formattingDiv.value = formatExample.toString();

    const customConfig = new Configuration();
    customConfig.display = Configuration.instance.display;
    formatConfig.currency = Configuration.instance.currency;
    customConfig.tag = Configuration.instance.tag;
    const customExample = new CurrencyAmount(tag, 100, {config: customConfig});

    const displayExample = document.getElementById('displayExample');
    if (displayExample) displayExample.value = customExample.toString();
};

let lastHighLight = Date.now();
const updateHighlightExample = () => {
    if (Date.now() <= lastHighLight + 1000)
        return;
    lastHighLight = Date.now();
    throw 'not implemented updateHighlightExample'
};

const initiateCustomElements = () => {
    Utils.getByClass('checkbox')
        .filter(e => e.checked !== false && e.checked !== true)
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
        case 'utilityHoverConvert':
        case 'usingWhitelist':
        case 'usingBlacklist':
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
    const setting = Configuration.instance.byStorageKey[key];
    if (!setting) throw `Unknown key '${key}'`;
    setting.setValue(value);
    if (key.indexOf('urls') >= 0) {
    } else if (typeof (element.change) === 'function')
        element.change(setting.value)
    else
        element.value = setting.value;

    if (key.indexOf('currency') >= 0 || key.indexOf('Display') >= 0 || key === 'decimalAmount')
        updateExamples();
    else if (key.indexOf('Highlight') >= 0)
        updateHighlightExample();
};


document.addEventListener("DOMContentLoaded", async function () {
    const config = Configuration.instance;
    await config.load();

    await setUiValue(Ids.currency, config.currency.tag.value);
    await updateCurrencyLists();

    initiateCustomElements();

    Browser.updateFooter();

    updateLists();

    // Normal fields
    const settings = Configuration.instance.settings;
    for (let i = 0; i < settings.length; i++) {
        const setting = settings[i];
        const value = setting.value;
        const key = setting.storageKey;
        // TODO: use setting.htmlId
        const htmlId = setting.storageKey;
        const element = document.getElementById(htmlId);
        await setUiValue(key, value);

        if (!element) continue;

        element.addEventListener('focus', () => element.style.border = '1px solid #f0ad4e');
        element.addEventListener('focusout', () => element.style.border = '');

        element.addEventListener('change', async function () {
            const oldValue = getUiValue(key);
            await setUiValue(key, oldValue);
            const newValue = getUiValue(key);

            if (newValue !== oldValue)
                document.getElementById(key).style.border = '1px solid red';
            else
                setting.save()
                    .then(() => document.getElementById(key).style.border = '1px solid green');
        });
    }

    // Newly installed banner
    const options = document.getElementById('options-wrapper');
    if (false) {
        const isFirstTime = await Browser.load(Utils.storageIds()).then(r => Object.keys(r).length === 0);
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