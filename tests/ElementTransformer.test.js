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
        'USD': 1,
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
        const expected = ['£', '2', '.', '49'];
        const textNodes = ElementTransformer.findTextNodes(amazonUk);
        const text = cleanResult(textNodes);
        expect(text).toEqual(expected);
    });

    it('Test transforms correctly intelligently', () => {
        const transformer = new ElementTransformer(engine);
        const clone = amazonUk.cloneNode(true);
        const textNodes = ElementTransformer.findTextNodes(clone);
        let cleanNodes = cleanResult(textNodes);

        const result = transformer.transformIntelligently(clone, false);
        result.updateUi();

        result.set(true);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['2.5 EUR']);

        result.set(false);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['£', '2', '.', '49']);
    });

    it('Test transforms correctly intelligently', () => {
        const transformer = new ElementTransformer(engine);
        const clone = amazonCa.cloneNode(true);
        const textNodes = ElementTransformer.findTextNodes(clone);
        let cleanNodes = cleanResult(textNodes);

        const result = transformer.transformIntelligently(clone, false);
        result.updateUi();

        result.set(true);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['2.5 EUR']);

        result.set(false);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['CDN$', '2', '.', '49']);
    });

    it('Test', () => {
        const transformer = new ElementTransformer(engine);
        const html = `<div class="a-row a-size-base a-color-secondary"><div class="a-row"><span>2 for </span><span>£10.00</span><span> on Blu-ray</span></div></div>`;
        div = document.createElement('div');
        div.innerHTML = html;
        const clone = div.children[0];

        const textNodes = ElementTransformer.findTextNodes(clone);
        let cleanNodes = cleanResult(textNodes);

        const result = transformer.transformIntelligently(clone, false);
        result.updateUi();

        result.set(true);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['2 for', '10 EUR', 'on Blu-ray']);

        result.set(false);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['2 for', '£10.00', 'on Blu-ray']);

    });


    it("Odd test", () => {
        // Setup
        const transformer = new ElementTransformer(engine);
        const data = 'pick up a $50/£50 words';
        div = document.createElement('div');
        div.innerHTML = '<span>pick up a $50/£50 words</span>';
        const clone = div.children[0];
        const expected = [
            new SearchResult(data, ' ', '', '', '/', 50, 'USD', 0),
            new SearchResult(data, '/', '', '', ' ', 50, 'GBP', 0),
        ];
        const textNodes = ElementTransformer.findTextNodes(clone);
        let cleanNodes = cleanResult(textNodes);

        // Act
        const result = transformer.transform(clone, false);
        result.updateUi();

        result.set(true);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['pick up a 50 EUR/50 EUR words']);

        result.set(false);
        cleanNodes = cleanResult(textNodes);
        expect(cleanNodes).toEqual(['pick up a $50/£50 words']);
    });
});