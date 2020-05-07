describe('CurrencyElement', () => {
    const create = html => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.children[0];
    }
    describe('Convert', () => {
        const tests = [
            {name: 'amazon', expect: ' 4 USD . ', element: create(`<span aria-hidden="true" id="aaa"><span class="a-price-symbol">$</span><span class="a-price-whole">3<span class="a-price-decimal">.</span></span><span class="a-price-fraction">99</span></span>`)},
            {name: 'aliexpress', expect: '280 - 360 USD', element: create(`<span class="product-price-value uacc-clickable" itemprop="price" style="" data-spm-anchor-id="a2g0o.detail.1000016.i2.132937d7JS6Tjc">US $282.98 - 361.08</span>`)},
            {name: 'whitespace', expect: '\n        23 USD\n    ', element: create(`<span id="price_inside_buybox" class="a-size-medium a-color-price" style="">
        22,99&nbsp;€
    </span>`)}

        ];
        tests.forEach(test => {
            it(`${test.name}`, async () => {
                // Setup
                const localization = new ActiveLocalization();
                localization.dollar = 'USD'
                const detector = new Detector({activeLocalization: localization});
                detector.updateSharedLocalizations();
                Currencies.instance._rates['EUR'] = Currencies.instance._rates['EUR'] || {};
                Currencies.instance._rates['EUR']['USD'] = new CurrencyRate('EUR', 'USD', 1, Date.now())
                const actual = new CurrencyElement(test.element, {detector: detector});

                // Act
                await actual.convertTo('USD');

                // Assert
                expect(actual._converted.texts.join(' ')).toEqual(test.expect)
            });
        })
    });
});