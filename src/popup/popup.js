let url;
const engine = new Engine();
const loader = engine.loadSettings();

const asList = (elements) => {
    const list = [];
    for (let i = 0; i < elements.length; i++)
        list.push(elements[i]);
    return list;
};

const createMiniConverterRow = () => {
    const temp = document.createElement('div');
    temp.innerHTML = `<div style="width:100%" class="">
    <div class="col-xs-1 mini-converter-col">
        <div class="custom-checkbox mini-converter-field"></div>
    </div>
    <div class="col-xs-3 mini-converter-col">
        <input class="mini-converter-field" style="text-align-last:right" type="number"/>
    </div>
    <div class="col-xs-2 mini-converter-col">
        <select class="mini-converter-field"></select>
    </div>
    <div class="col-xs-1 mini-converter-col" style="text-align: center;"> = </div>
    <div class="col-xs-5 mini-converter-col">
        <input class="mini-converter-field" type="text" readonly/>
    </div>
</div>`.trim();
    return temp.children[0];
};

const initiateMiniConverter = async (engine) => {
    const settings = await Browser.load(['popupCurrencies', 'popupAmounts']);
    const loadCurrencies = settings['popupCurrencies'] || [];
    const loadAmounts = settings['popupAmounts'] || [];

    const rows = [
        createMiniConverterRow(),
        createMiniConverterRow(),
        createMiniConverterRow(),
        createMiniConverterRow(),
        createMiniConverterRow(),
    ];
    const checkWrappers = rows.map(e => e.children[0]);
    const checks = checkWrappers.map(e => e.children[0]);
    const amounts = rows.map(e => e.children[1].children[0]);
    const currencies = rows.map(e => e.children[2].children[0]);
    const results = rows.map(e => e.children[4].children[0]);

    const getAmounts = () => amounts.map(e => e.value || 0);
    const getCurrencies = () => currencies.map(e => e.children[e.selectedIndex].value || 'EUR');

    checkWrappers.forEach(e => e.addEventListener('click', () => e.children[0].click()));
    checks.forEach((c, i) => c.addEventListener('click', () => {
        if (c.classList.contains('custom-checkbox-checked')) return;
        checks.forEach(a => a.classList.remove('custom-checkbox-checked'));
        c.classList.add('custom-checkbox-checked');
        engine.currencyConverter.withBaseCurrency(
            currencies[i].children[currencies[i].selectedIndex].value);
        changeEvent();
    }));

    const selectables = Object.keys(engine.currencyDetector.currencies)
        .sort()
        .map(tag => `<option value="${tag}">${tag}</option>`)
        .join('');

    const changeEvent = () => {
        const amounts = getAmounts();
        const currencies = getCurrencies();
        Browser.save({
            popupCurrencies: currencies,
            popupAmounts: amounts,
        }).catch(e => console.error(e));
        engine.customTag.using(false);

        amounts.forEach((amount, i) => {
            const currency = currencies[i];
            const result = engine.transform(amount, currency);
            results[i].value = result;
        });
    };

    currencies.forEach((c, i) => {
        c.innerHTML = selectables;
        c.value = loadCurrencies[i] || engine.currencyConverter.baseCurrency;
        c.addEventListener('change', () => {
            if (checks[i].classList.contains('custom-checkbox-checked'))
                engine.currencyConverter.withBaseCurrency(c.children[c.selectedIndex].value);
            changeEvent()
        });
    });
    amounts.forEach((c, i) => {
        c.value = loadAmounts[i] || 1;
        c.addEventListener('change', () => changeEvent());
    });

    // Finalize converter
    const converter = document.getElementById('mini-converter');
    checks[0].click();
    rows.forEach(r => converter.appendChild(r));
};

const initiateBlacklisting = async (url, engine) => {
    const blacklist = engine.blacklist;
    document.getElementById('blacklistInput').value = url;
    const button = document.getElementById('blacklistButton');
    const isBlacklisting = !blacklist.isBlacklisted(url);
    button.innerText = isBlacklisting ? 'Blacklist' : 'Whitelist';
    button.classList.remove(isBlacklisting ? 'btn-success' : 'btn-danger');
    button.classList.add(isBlacklisting ? 'btn-danger' : 'btn-success');
    button.addEventListener('click', async () => {
        const isBlacklisting = blacklist.isBlacklisted(url);
        const button = document.getElementById('blacklistButton');
        button.innerText = isBlacklisting ? 'Blacklist' : 'Whitelist';
        button.classList.remove(isBlacklisting ? 'btn-success' : 'btn-danger');
        button.classList.add(isBlacklisting ? 'btn-danger' : 'btn-success');
        if (!isBlacklisting) blacklist.withUrls(url);
        else blacklist.whitelist(url);
        await Browser.save('blacklistingurls', blacklist.urls);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    Browser.updateFooter();

    const hideButton = document.getElementById('hideConversions');
    let isConverted = false;
    hideButton.addEventListener('click', () => {
        Browser.messageTab({
            method: 'convertAll',
            converted: isConverted
        }).finally();
        hideButton.innerText = isConverted ? 'Hide conversions' : 'Show conversions';
        hideButton.classList.remove(isConverted ? 'btn-success' : 'btn-danger');
        hideButton.classList.add(isConverted ? 'btn-danger' : 'btn-success');
        isConverted = !isConverted;
    });

    // Get conversion count
    Browser.messageTab({method: 'conversionCount'})
        .then(resp => document.getElementById('conversionCount').value = (Utils.isDefined(resp) ? resp : 0) + ' conversions');

    // Get current localization settings
    [{symbol: '$', id: 'dollar'}, {symbol: 'kr', id: 'kroner'}, {symbol: '¥', id: 'asian'}]
        .forEach(data => Browser.messageTab({method: 'getLocalization', symbol: data.symbol})
            .then(resp => document.getElementById(data.id).value = Utils.isDefined(resp) ? resp : '?')
            .then(() => document.getElementById(data.id))
            .then(selector => selector.addEventListener('change', () => {
                const value = selector.children[selector.selectedIndex].value;
                Browser.messageTab({method: 'setLocalization', symbol: data.symbol, to: value}).finally();
            })));

    // Get current url
    const loadingUrl = Browser.messageTab({method: 'getUrl'})
        .then(resp => {
            if (!resp) return;
            if (typeof resp !== 'string') return;
            resp = resp.replace(/^(https?:\/\/)?(www\.)?/, '');
            return resp.split('/')[0];
        });

    loader.finally(async () => {
        initiateMiniConverter(engine).catch(e => console.error(e));
        url = await loadingUrl;
        initiateBlacklisting(url, engine).catch(e => console.error(e));
    });

    /*
    chrome.runtime.onMessage.addListener(function (request, sender, senderResponse) {
        senderResponse({success: true});
        return true;
    });
    */
});