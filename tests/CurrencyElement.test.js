describe('CurrencyElement', () => {
    const create = html => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.children[0];
    }
    describe('Convert', () => {
        const tests = [
            {name: 'amazon', element: create(`<span aria-hidden="true" id="aaa"><span class="a-price-symbol">$</span><span class="a-price-whole">3<span class="a-price-decimal">.</span></span><span class="a-price-fraction">99</span></span>`), expect: [1]}
        ];
        tests.forEach(test => {
            it(`${test.name}`, async () => {
                // Setup
                const localization = new ActiveLocalization();
                localization.dollar = 'USD'
                const detector = new Detector({activeLocalization: localization});
                detector.updateSharedLocalizations();
                const element = new CurrencyElement(test.element, {detector: detector});

                // Act
                await element.convertTo('USD');

                // Assert
                expect(actual.length).toEqual(test.expect.length)
            });
        })
    });
});