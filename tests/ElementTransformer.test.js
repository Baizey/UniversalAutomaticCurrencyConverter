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

    it('Test finds touched elements correctly', () => {
        const transformer = new ElementTransformer(engine);
        transformer.withConversionType(ConversionTypes.intelligently);
        const expected = ['£', '2', '.', '49'];
        const textNodes = ElementTransformer.findTextNodes(test);

        const touched = transformer.findTouchedNodes(textNodes, 0, 5);

        const text = cleanResult(textNodes);
        expect(text).toEqual(expected);
        expect(touched.start).toEqual(0);
    });

    it('Test transforms correctly intelligently', () => {
        const transformer = new ElementTransformer(engine);
        transformer.withConversionType(ConversionTypes.intelligently);
        const clone = test.cloneNode(true);
        const textNodes = ElementTransformer.findTextNodes(clone);

        const [, set] = transformer.transformIntelligently(clone, false);

        set(true);
        expect(cleanResult(textNodes)).toEqual(['', '2.5 EUR', '', '']);

        set(false);
        expect(cleanResult(textNodes)).toEqual(['£', '2', '.', '49']);
    });
});