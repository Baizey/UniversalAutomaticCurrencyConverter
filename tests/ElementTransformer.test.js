describe('ElementTransformer tests', () => {
    const cleanResult = a => a.map(e => e.textContent.trim()).filter(e => e);
    const browser = Browser.instance({
        type: Browsers.Chrome,
        access: null
    });
    const detector = new CurrencyDetector(browser);
    detector.localize('com');
    const engine = new Engine(browser, detector);
    engine.numberFormatter.withRounding(2);
    engine.currencyConverter.withBaseCurrency('EUR');
    engine.currencyConverter.withConversionRatesBase('EUR');
    engine.currencyConverter.withConversionRates({
        'GBP': 1,
        'EUR': 1,
    });

    const temp = `<span aria-hidden="true">
    <span class="a-price-symbol">£</span>
    <span class="a-price-whole">2
        <span class="a-price-decimal">.</span>
    </span>
    <span class="a-price-fraction">49</span>
</span>`;
    const div = document.createElement('div');
    div.innerHTML = temp;
    const test = div.children[0];

    it('Test finds elements in correct order', () => {
        const transformer = new ElementTransformer(engine);
        transformer.withConversionType(ConversionTypes.intelligently);
        const expected = ['£', '2', '.', '49'];
        const textNodes = ElementTransformer.findTextNodes(test);
        const text = cleanResult(textNodes);
        expect(text).toEqual(expected);
    });

    it('Test transforms correctly intelligently', () => {
        const transformer = new ElementTransformer(engine);
        transformer.withConversionType(ConversionTypes.intelligently);
        const clone = test.cloneNode(true);
        const textNodes = ElementTransformer.findTextNodes(clone);
        let cleanNodes = cleanResult(textNodes);

        const result = transformer.transformIntelligently(clone, false);
        result.updateUi();

        result.set(true);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['2.5 EUR', '.']);

        result.set(false);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['£', '2', '.', '49']);
    });
});