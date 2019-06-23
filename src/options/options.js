const engine = new Engine();
const collapseState = {};

let collapseItems;
collapseItems = tag => {
    const elements = document.getElementsByTagName(tag);
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const id = `${tag}-${i}`;
        element.classList.add('clickable');
        const parent = element.parentElement;
        const targets = parent.children;
        element.children[0].classList.add('opened');
        element.children[1].classList.add('opened');
        element.addEventListener('click', () => {
                const state = (collapseState[id] = !collapseState[id]);
                if (state) {
                    element.children[0].classList.remove('opened');
                    element.children[1].classList.remove('opened');
                    parent.classList.add('setting-tab-no-padding');
                    element.classList.add('setting-title-extra-padding');
                    for (let j = 1; j < targets.length; j++)
                        targets[j].classList.add('hidden');
                } else {
                    element.children[0].classList.add('opened');
                    element.children[1].classList.add('opened');
                    parent.classList.remove('setting-tab-no-padding');
                    element.classList.remove('setting-title-extra-padding');
                    for (let j = 1; j < targets.length; j++)
                        targets[j].classList.remove('hidden');
                }
            }
        );
    }
};

const updateCurrencyLists = async () => {
    const rates = engine.getConversionRates();
    const symbols = await engine.getCurrencySymbols().catch(() => ({}));
    const selectables = Object.keys(symbols.symbols)
        .sort()
        .map(tag => `<option value="${tag}">${symbols.symbols ? `${tag} (${symbols.symbols[tag]})` : tag}</option>`)
        .join('');
    const atCurrency = getUiValue('currency');
    document.getElementById('currency').innerHTML = selectables;
    await rates;
    await setUiValue('currency', atCurrency);
}

const updateBlacklist = wrapper => {
    const children = wrapper.children;
    const urls = [];
    for (let i = 0; i < children.length; i++) {
        const value = children[i].value;
        if (value)
            urls.push(children[i].value);
        else
            wrapper.removeChild(children[i--]);
    }
    engine.blacklist.withUrls(urls);
    Browser.save('blacklistingurls', engine.blacklist.urls);
    createBlacklistField(wrapper);
};

const createBlacklistField = (wrapper, value = '') => {
    const element = document.createElement(`input`);
    element.classList.add('url', 'form-control');
    element.placeholder = 'https://...';
    element.style.borderRadius = '0';
    element.value = value;
    element.addEventListener('change', () => updateBlacklist(wrapper));
    wrapper.appendChild(element);
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
        case 'currencyApikey':
        case 'decimalAmount':
        case 'currencyCustomTagValue':
            return element.value;

        // Checkbox
        case 'currencyUsingAutomatic':
        case 'usingBlacklist':
        case 'isBlacklisting':
        case 'currencyUsingHighlight':
        case 'currencyUsingCustomTag':
        case 'usingCurrencyConverter':
        case 'intelligentRounding':
            return element.checked;

        // Selector
        case 'currency':
            return element.children[element.selectedIndex].value || 'EUR';
        // Selector
        case 'thousandDisplay':
        case 'decimalDisplay':
            return element.children[element.selectedIndex].value;
    }
};

const setUiValue = async (key, value) => {
    const element = document.getElementById(key);
    switch (key) {
        case 'currencyUsingAutomatic':
            engine.shouldAutoconvert(value);
            element.change(engine.automaticPageConversion);
            break;
        case 'usingBlacklist':
            engine.blacklist.using(value);
            element.change(engine.blacklist.isEnabled);
            break;

        case 'currencyHighlightColor':
            engine.highlighter.withColor(value);
            element.value = engine.highlighter.color;
            break;
        case 'currencyHighlightDuration':
            engine.highlighter.withDuration(value);
            element.value = engine.highlighter.duration;
            break;
        case 'currencyUsingHighlight':
            engine.highlighter.using(value);
            element.change(engine.highlighter.isEnabled);
            break;
        case 'currency':
            engine.currencyConverter.withBaseCurrency(value);
            element.value = engine.currencyConverter.baseCurrency;
            break;
        case 'currencyShortcut':
            engine.withCurrencyShortcut(value);
            element.value = engine.conversionShortcut;
            break;
        case 'currencyApikey':
            engine.withApikey(value);
            if (value) {
                const symbols = await engine.getCurrencySymbols();
                if (!symbols || !symbols.symbols)
                    engine.withApikey('');
                else {
                    await updateCurrencyLists();
                }
            }
            element.value = engine.apikey;
            break;
        case 'currencyCustomTagValue':
            engine.customTag.withValue(value);
            element.value = engine.customTag.value;
            break;
        case 'currencyCustomTag':
            engine.customTag.withTag(value);
            element.value = engine.customTag.tag;
            break;
        case 'currencyUsingCustomTag':
            engine.customTag.using(value);
            element.change(engine.customTag.enabled);
            break;
        case 'usingCurrencyConverter':
            engine.using(value);
            element.change(engine.isEnabled);
            break;
        case 'thousandDisplay':
            engine.numberFormatter.withThousand(value);
            element.value = engine.numberFormatter.thousand;
            break;
        case 'decimalDisplay':
            engine.numberFormatter.withDecimal(value);
            element.value = engine.numberFormatter.decimal;
            break;
        case 'decimalAmount':
            engine.numberFormatter.withRounding(Math.round(value));
            element.value = engine.numberFormatter.rounding;
            break;
        default:
            throw 'Unknown element';
    }
};

document.addEventListener("DOMContentLoaded", async function () {
    Utils.initiateCheckboxes();
    collapseItems('h2');
    collapseItems('h3');
    Browser.updateFooter();

    await engine.loadSettings();
    document.getElementById('currencyLastUpdate').innerText = engine.lastCurrencyUpdate;

    // Conversion shortcut
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

    // Blacklist
    const wrapper = document.getElementById('currencyBlacklistUrls');
    engine.blacklist.urls.forEach(url => createBlacklistField(wrapper, url));
    createBlacklistField(wrapper);

    Utils.storageIds().forEach(async id => {
        if (Utils.manualStorageIds()[id])
            return;
        const value = engine.getById(id);
        const element = document.getElementById(id);

        await setUiValue(id, value);

        element.addEventListener('focus', function () {
            document.getElementById(this.id).style.border = '1px solid #f0ad4e';
        });
        element.addEventListener('focusout', function () {
            document.getElementById(this.id).style.border = '';
        });

        document.getElementById(id).addEventListener('change', async function () {
            const oldValue = getUiValue(id);
            await setUiValue(id, oldValue);
            const newValue = getUiValue(id);

            if (newValue !== oldValue)
                document.getElementById(id).style.border = '1px solid red';
            else
                Browser.save(id, oldValue).then(() => document.getElementById(id).style.border = '1px solid green');
        });
    });
});