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
                const expected = [new SearchResult(text, '', '', '', '', [5], 'USD')];

                const actual = detector.findAll(text);

                expect(actual).toEqual(expected);
            });
        });
    });

});