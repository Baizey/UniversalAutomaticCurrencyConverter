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
                const expected = new SearchResult(text, '', '', '', '', [5], 'USD');

                const actual = detector.findAll(text)[0];

                expect(actual.raw).toBe(expected.raw);
                expect(actual.numbers).toEqual(expected.numbers);
                expect(actual.currency).toBe(expected.currency);
            });
        });
        [
            {number: '5-10', currency: 'USD'},
            {number: '5-10', currency: 'USD'},
            {number: '5,600.20', currency: 'USD'},
        ].forEach(data => {
            const text = data.number + data.currency;
            it(`${text} converts properly`, () => {
                const numbers = data.number.split('-').map(e => e.replace(/[^\d.]/g, '')).map(e => e-0);
                const expected = new SearchResult(text, '', '', '', '', numbers, data.currency);

                const actual = detector.findAll(text)[0];

                expect(actual.raw).toBe(expected.raw);
                expect(actual.numbers).toEqual(expected.numbers);
                expect(actual.currency).toBe(expected.currency);
            });
        });

    });

});