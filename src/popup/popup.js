const engine = new Engine();
const loader = engine.loadSettings();
const asList = (elements) => {
    const list = [];
    for (let i = 0; i < elements.length; i++)
        list.push(elements[i]);
    return list;
};
const createMiniConverterRow = (currencies, amount, currency) => {
    const select = Object.keys(currencies).sort().map(tag => `<option value="${tag}">${tag}</option>`).join('');
    const temp = document.createElement('div');
    temp.innerHTML = `<div style="border: solid 1px #0F171E; width:100%; height:22px">
        <div class="col-xs-1 mini-converter-col">
                <div class="circle-plus closed">
                    <div class="circle">
                        <div class="horizontal"></div>
                        <div class="vertical"></div>
                    </div>
                </div>
        </div>
        <div class="col-xs-3 mini-converter-col">
            <input class="mini-converter-field" style="text-align-last:right" type="number"/>
        </div>
        <div class="col-xs-2 mini-converter-col">
            <select class="mini-converter-field">${select}</select>
        </div>
        <div class="col-xs-1 mini-converter-col" style="text-align: center;"> = </div>
        <div class="col-xs-5 mini-converter-col">
            <input class="mini-converter-field" type="text" readonly/>
        </div>
</div>`.trim();
    const result = temp.children[0];
    result.children[1].children[0].value = amount;
    result.children[2].children[0].value = currency;
    return result;
};
const makeFunctional = (row, onChange) => {
    row.children[0].children[0].addEventListener('click', () => {
        row.remove();
        onChange();
    });
    row.children[0].children[0].addEventListener('mouseover', () => row.classList.add('delete-focus'));
    row.children[0].children[0].addEventListener('mouseout', () => row.classList.remove('delete-focus'));
    row.children[1].children[0].addEventListener('change', () => onChange());
    row.children[2].children[0].addEventListener('change', () => onChange());
};
const initiateMiniConverter = async (engine) => {
    const settings = await Browser.load(['popupCurrencies', 'popupAmounts', 'popupConvertTo']);
    const loadCurrencies = settings['popupCurrencies'] || [];
    let loadAmounts = settings['popupAmounts'] || [];
    let convertTo = settings['popupConvertTo'] || engine.currencyConverter.baseCurrency;

    if (!Array.isArray(loadAmounts)) loadAmounts = [loadAmounts];

    const selectedCurrency = document.getElementById('mini-converter-to');
    const addCurrency = document.getElementById('mini-converter-add');
    const wrapper = document.getElementById('mini-converter');
    const rows = () => asList(wrapper.children);

    const onChange = () => {
        const data = rows();
        const currencies = [];
        const amounts = [];
        engine.customTag.using(false);
        data.forEach(row => {
            const amount = row.children[1].children[0].value;
            const element = row.children[2].children[0];
            const currency = element.children[element.selectedIndex].value;
            amounts.push(amount);
            currencies.push(currency);
            row.children[4].children[0].value = engine.transform(amount, currency);
        });
        Browser.save({
            popupCurrencies: currencies,
            popupAmounts: amounts,
        }).catch(e => console.error(e));
    };

    const symbols = (await Browser.httpGet('symbols')).symbols;
    selectedCurrency.innerHTML = Object.keys(symbols).sort().map(tag => `<option value="${tag}">${tag} (${symbols[tag]})</option>`).join('');
    selectedCurrency.value = convertTo;
    selectedCurrency.addEventListener('change', () => {
        const currency = selectedCurrency.children[selectedCurrency.selectedIndex].value;
        engine.currencyConverter.withBaseCurrency(currency);
        Browser.save('popupConvertTo', currency).finally();
        convertTo = currency;
        onChange();
    });

    const curr = loadAmounts.map((amount, i) => createMiniConverterRow(engine.currencyDetector.currencies, amount, loadCurrencies[i]));
    curr.forEach(row => makeFunctional(row, onChange));

    addCurrency.addEventListener('click', () => {
        const row = createMiniConverterRow(engine.currencyDetector.currencies, 1, convertTo);
        makeFunctional(row, onChange);
        wrapper.appendChild(row);
        onChange();
    });

    curr.forEach(row => wrapper.appendChild(row));
    onChange();
};
const initiateBlacklisting = async (engine) => {
    const field = document.getElementById('blacklistInput');
    field.value = Browser.hostname;
    const button = document.getElementById('blacklistButton');
    if (!Browser.hostname) {
        document.getElementById('conversion').classList.add('hidden');
        document.getElementById('localization').classList.add('hidden');
        document.getElementById('no_conversion').classList.remove('hidden');
        return;
    }

    field.value = Browser.hostname;
    const blacklist = engine.blacklist;
    const whitelist = engine.whitelist;
    const isBlacklisting = !whitelist.isEnabled;

    const list = isBlacklisting ? blacklist : whitelist;
    const text = isBlacklisting ? 'blacklisting' : 'whitelisting';
    const urlStorage = isBlacklisting ? 'blacklistingurls' : 'whitelistingurls';

    const onList = list.isBlacklisted(Browser.hostname);
    button.innerText = onList ? `Remove ${text}` : `Add ${text}`;
    button.classList.remove(onList ? 'btn-danger' : 'btn-success');
    button.classList.add(onList ? 'btn-success' : 'btn-danger');

    button.addEventListener('click', async () => {
        const onList = list.isBlacklisted(Browser.hostname);
        button.innerText = onList ? `Add ${text}` : `Remove ${text}`;
        button.classList.remove(onList ? 'btn-success' : 'btn-danger');
        button.classList.add(onList ? 'btn-danger' : 'btn-success');
        if (!onList) list.withUrl(Browser.hostname);
        else list.whitelist(Browser.hostname);
        await Browser.save(urlStorage, list.urls);
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    await Browser.messageTab({method: 'getUrl'})
        .then(resp => Browser.setHostname(resp))
        .catch(() => Browser.setHostname(''));
    Browser.updateFooter();
    document.getElementById('review').addEventListener('click', () => Browser.updateReviewLink());

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

    loader.finally(async () => {
        document.getElementById('currencyLastUpdate').innerText = engine.lastCurrencyUpdate;
        initiateMiniConverter(engine).catch(e => console.error(e));
        initiateBlacklisting(engine).catch(e => console.error(e));
    });
});