const asList = (elements) => {
    const list = [];
    for (let i = 0; i < elements.length; i++)
        list.push(elements[i]);
    return list;
};
/**
 * @param {MiniConverterRow} row
 * @returns {Promise<void>}
 */
const createMiniConverterRow = async (row) => {
    const currencies = await Currencies.instance.symbols();
    const select = Object.keys(currencies).sort().map(tag => `<option value="${tag}">${tag}</option>`).join('');
    const temp = document.createElement('div');
    temp.innerHTML = `<div class="mini-converter-row" style="border: solid 1px #0F171E; width:100%; height:22px">
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
        <div class="col-xs-1 mini-converter-col" style="text-align: center;"> ⇒ </div>
        <div class="col-xs-3 mini-converter-col">
            <input class="mini-converter-field" style="text-align-last:right" type="text" readonly/>
        </div>
        <div class="col-xs-2 mini-converter-col">
            <select class="mini-converter-field">${select}</select>
        </div>
</div>`.trim();
    const result = temp.children[0];
    result.children[1].children[0].value = row.amount;
    result.children[2].children[0].value = row.from;
    result.children[4].children[0].value = await row.convertedValue().then(e => e.displayValue);
    result.children[5].children[0].value = row.to;
    result.children[0].children[0].addEventListener('mouseover', () => result.classList.add('delete-focus'));
    result.children[0].children[0].addEventListener('mouseout', () => result.classList.remove('delete-focus'));
    result.children[0].children[0].addEventListener('click', () => {
        result.remove();
        MiniConverter.instance.remove(row);
    });
    result.children[1].children[0].addEventListener('change', async () => {
        row.amount = result.children[1].children[0].value;
        result.children[4].children[0].value = await row.convertedValue().then(e => e.displayValue);
        await MiniConverter.instance.save();
    });
    result.children[2].children[0].addEventListener('change', async () => {
        row.from = result.children[2].children[0].children[result.children[2].children[0].selectedIndex].value;
        result.children[4].children[0].value = await row.convertedValue().then(e => e.displayValue);
        await MiniConverter.instance.save();
    });
    result.children[5].children[0].addEventListener('change', async () => {
        row.to = result.children[5].children[0].children[result.children[5].children[0].selectedIndex].value;
        result.children[4].children[0].value = await row.convertedValue().then(e => e.displayValue);
        await MiniConverter.instance.save();
    });
    document.getElementById('mini-converter').appendChild(result);
};

const isLegitUrl = url => {
    try {
        return new URL(url);
    } catch (e) {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const browser = Browser.instance;
    Browser.updateFooter();
    document.getElementById('review').addEventListener('click', () => Browser.updateReviewLink());
    browser._fullHref = await browser.tab.getHref().catch(() => 'unknown');
    const url = isLegitUrl(browser.href);
    if (url) {
        browser._fullHostName = url.hostname;
        const localization = ActiveLocalization.instance;
        await Engine.instance.load().catch();
        document.getElementById('blacklistInput').value = browser.hostname;
        const conversionCount = await browser.tab.getConversionCount().catch(() => 0);
        document.getElementById('conversionCount').value = `${conversionCount || 0} conversions`;
        document.getElementById('krone').value = localization.krone;
        document.getElementById('yen').value = localization.yen;
        document.getElementById('dollar').value = localization.dollar;
        ['krone', 'yen', 'dollar'].forEach(htmlId => {
            const element = document.getElementById(htmlId);
            if (!element) return;
            element.addEventListener('change', async () => {
                const update = {[htmlId]: element.children[element.selectedIndex].value}
                await localization.overload(update);
                await browser.tab.setLocalization(localization.compact);
            });
        })

    } else {
        document.getElementById('localization').classList.add('hidden');
        document.getElementById('conversion').classList.add('hidden');
        document.getElementById('no_conversion').classList.remove('hidden');
    }

    const converter = MiniConverter.instance;
    await converter.load();
    for (let i in converter.conversions) await createMiniConverterRow(converter.conversions[i]);
    document.getElementById('mini-converter-add').addEventListener('click', async () => {
        const row = await converter.addNewRow();
        await createMiniConverterRow(row);
    });

    const hideButton = document.getElementById('hideConversions');
    /*
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
     */
});