/**
 * @param {MiniConverterRow} row
 * @param {string} template
 * @returns {Promise<void>}
 */
const createMiniConverterRow = async (row, template) => {
    const temp = document.createElement('div');
    temp.innerHTML = template;

    const result = temp.children[0];
    const deleteInput = result.children[0].children[0];
    const amountInput = result.children[1].children[0];
    const fromInput = result.children[2].children[0];
    const exchangeInput = result.children[3];
    const resultInput = result.children[4].children[0];
    const toInput = result.children[5].children[0];

    amountInput.value = row.amount;
    fromInput.value = row.from;
    resultInput.value = await row.displayValue();
    toInput.value = row.to;

    exchangeInput.addEventListener('click', async () => {
        row.amount = Number(await row.displayValue());
        row.to = fromInput.value;
        row.from = toInput.value;

        amountInput.value = row.amount;
        toInput.value = row.to;
        fromInput.value = row.from;
        resultInput.value = await row.displayValue();
        await MiniConverter.instance.save();
    });

    deleteInput.addEventListener('mouseover', () => result.classList.add('delete-focus'));
    deleteInput.addEventListener('mouseout', () => result.classList.remove('delete-focus'));
    deleteInput.addEventListener('click', () => {
        result.remove();
        MiniConverter.instance.remove(row);
    });
    amountInput.addEventListener('change', async () => {
        row.amount = amountInput.value;
        resultInput.value = await row.displayValue();
        await MiniConverter.instance.save();
    });
    fromInput.addEventListener('change', async () => {
        row.from = fromInput.children[fromInput.selectedIndex].value;
        resultInput.value = await row.displayValue();
        await MiniConverter.instance.save();
    });
    toInput.addEventListener('change', async () => {
        row.to = toInput.children[toInput.selectedIndex].value;
        resultInput.value = await row.displayValue();
        await MiniConverter.instance.save();
    });
    document.getElementById('mini-converter').appendChild(result);
};

document.addEventListener('DOMContentLoaded', async () => {
    const converter = MiniConverter.instance;
    const browser = Browser.instance;

    await Engine.instance.load();
    await converter.load();

    const currencies = await Currencies.instance.symbols();
    const select = Object.keys(currencies).sort().map(tag => `<option value="${tag}">${tag}</option>`).join('');
    const template = (await browser.background.getHtml('rowConverter')).replace(/\${select}/g, select);

    Browser.updateFooter();
    document.getElementById('review').addEventListener('click', () => browser.openReviewLink());
    document.getElementById('patreon').addEventListener('click', () => browser.openPatreon());
    document.getElementById('openContext').addEventListener('click', () => browser.tab.contextMenu());
    for (let i in converter.conversions) await createMiniConverterRow(converter.conversions[i], template);
    document.getElementById('mini-converter-add').addEventListener('click', async () => {
        const row = await converter.addNewRow();
        await createMiniConverterRow(row, template);
    });
});