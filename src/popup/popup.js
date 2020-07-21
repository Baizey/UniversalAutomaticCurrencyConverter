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
        <div class="col-xs-1 mini-converter-col mini-converter-exchange" style="height: 100%;text-align: center;">
            <div style="width: 100%; height: 40%"></div>
            <div style="width: 100%; height: 1px"><span class="arrow redArrow"></span></div>
            <div style="width: 100%; height: 1px"><span class="arrow greenArrow"></span></div>
        </div>
        <div class="col-xs-3 mini-converter-col">
            <input class="mini-converter-field" style="text-align-last:right" type="text" readonly/>
        </div>
        <div class="col-xs-2 mini-converter-col">
            <select class="mini-converter-field">${select}</select>
        </div>
</div>`.trim();
    const result = temp.children[0];
    const amountInput = result.children[1].children[0];
    const fromInput = result.children[2].children[0];
    const toInput = result.children[5].children[0];
    const resultInput = result.children[4].children[0];

    amountInput.value = row.amount;
    fromInput.value = row.from;

    result.children[3].addEventListener('click', async () => {
        row.amount = (await row.convertedValue()).amount[0].toFixed(2) - 0;
        row.to = fromInput.value;
        row.from = toInput.value;

        amountInput.value = row.amount;
        toInput.value = row.to;
        fromInput.value = row.from;
        resultInput.value = await row.convertedValue().then(e => e.displayValue[0]);
        await MiniConverter.instance.save();
    });

    resultInput.value = await row.convertedValue().then(e => e.displayValue[0]);
    result.children[5].children[0].value = row.to;
    result.children[0].children[0].addEventListener('mouseover', () => result.classList.add('delete-focus'));
    result.children[0].children[0].addEventListener('mouseout', () => result.classList.remove('delete-focus'));
    result.children[0].children[0].addEventListener('click', () => {
        result.remove();
        MiniConverter.instance.remove(row);
    });
    result.children[1].children[0].addEventListener('change', async () => {
        row.amount = result.children[1].children[0].value;
        result.children[4].children[0].value = await row.convertedValue().then(e => e.displayValue[0]);
        await MiniConverter.instance.save();
    });
    result.children[2].children[0].addEventListener('change', async () => {
        row.from = result.children[2].children[0].children[result.children[2].children[0].selectedIndex].value;
        result.children[4].children[0].value = await row.convertedValue().then(e => e.displayValue[0]);
        await MiniConverter.instance.save();
    });
    result.children[5].children[0].addEventListener('change', async () => {
        row.to = result.children[5].children[0].children[result.children[5].children[0].selectedIndex].value;
        result.children[4].children[0].value = await row.convertedValue().then(e => e.displayValue[0]);
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
    document.getElementById('review').addEventListener('click', () => browser.openReviewLink());
    browser._fullHref = await browser.tab.getHref().catch(() => 'unknown');
    const url = isLegitUrl(browser.href);

    document.getElementById('openContext').addEventListener('click', () => {
        Browser.instance.tab.contextMenu();
    });

    const converter = MiniConverter.instance;
    await converter.load();
    for (let i in converter.conversions) await createMiniConverterRow(converter.conversions[i]);
    document.getElementById('mini-converter-add').addEventListener('click', async () => {
        const row = await converter.addNewRow();
        await createMiniConverterRow(row);
    });
});