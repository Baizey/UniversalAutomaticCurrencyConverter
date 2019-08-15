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
        'CAD': 1,
    });

    const _amazonCa = `<span aria-hidden="true"><span class="a-price-symbol">CDN$</span><span class="a-price-whole">2<span class="a-price-decimal">.</span></span><span class="a-price-fraction">49</span></span>`;
    const _amazonUk = `<span aria-hidden="true"><span class="a-price-symbol">£</span><span class="a-price-whole">2<span class="a-price-decimal">.</span></span><span class="a-price-fraction">49</span></span>`;
    let div = document.createElement('div');
    div.innerHTML = _amazonUk;
    const amazonUk = div.children[0];
    div = document.createElement('div');
    div.innerHTML = _amazonCa;
    const amazonCa = div.children[0];

    it('Test finds elements in correct order', () => {
        const transformer = new ElementTransformer(engine);
        transformer.withConversionType(ConversionTypes.intelligently);
        const expected = ['£', '2', '.', '49'];
        const textNodes = ElementTransformer.findTextNodes(amazonUk);
        const text = cleanResult(textNodes);
        expect(text).toEqual(expected);
    });

    it('Test transforms correctly intelligently', () => {
        const transformer = new ElementTransformer(engine);
        transformer.withConversionType(ConversionTypes.intelligently);
        const clone = amazonUk.cloneNode(true);
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

    it('Test transforms correctly intelligently', () => {
        const transformer = new ElementTransformer(engine);
        transformer.withConversionType(ConversionTypes.intelligently);
        const clone = amazonCa.cloneNode(true);
        const textNodes = ElementTransformer.findTextNodes(clone);
        let cleanNodes = cleanResult(textNodes);

        const result = transformer.transformIntelligently(clone, false);
        result.updateUi();

        result.set(true);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['2.5 EUR', '.']);

        result.set(false);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['CDN$', '2', '.', '49']);
    });
});