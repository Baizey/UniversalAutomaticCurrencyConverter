describe('Engine tests', () => {
    const browser = Browser.instance({
        type: Browsers.Chrome,
        access: null
    });
    const detector = new CurrencyDetector(browser);
    detector.localize('com');

    describe('Transformation tests', () => {
        const engine = new Engine(browser, detector);
        engine.currencyConverter.withBaseCurrency('USD');
        [
            '5USD',
            'USD5',
            'USD5USD',
            '$5USD',
            'USD5$',
        ].forEach(text => {
            it(`${text} converts properly`, () => {
                const actual = engine.transform(detector.findAll(text)[0]);
                expect(actual).toBe('5 USD');
            });
        });
    });

});