describe('CurrencyAmount', () => {
    describe('Rounding', () => {
        const tests = [
            {input: 0, expect: '0', rounding: 1},
            {input: 2, expect: '2', rounding: 1},
            {input: 52.6, expect: '50', rounding: 1},
            {input: 5.52, expect: '6', rounding: 1},
            {input: 5.55, expect: '6', rounding: 1},
            {input: 5489, expect: '5000', rounding: 1},
            {input: 0.505, expect: '0.5', rounding: 1},
            {input: 1e-15, expect: '0.000000000000001', rounding: 1},
            {input: 1e-16, expect: '0', rounding: 1},

            {input: 0.000001, expect: '0.0000010', rounding: 2},
            {input: 0.0000001, expect: '0.00000010', rounding: 2},
            {input: 0, expect: '0', rounding: 2},
            {input: 2, expect: '2', rounding: 2},
            {input: 7.467600002761219, expect: '7.5', rounding: 2},
            {input: 52.6, expect: '53', rounding: 2},
            {input: 5.52, expect: '5.5', rounding: 2},
            {input: 5.55, expect: '5.6', rounding: 2},
            {input: 5489, expect: '5500', rounding: 2},
            {input: 0.505, expect: '0.51', rounding: 2},

            {input: 0, expect: '0', rounding: 3},
            {input: 52.6, expect: '52.6', rounding: 3},
            {input: 5.52, expect: '5.52', rounding: 3},
            {input: 5.55, expect: '5.55', rounding: 3},
            {input: 5489, expect: '5490', rounding: 3},
            {input: 0.505, expect: '0.51', rounding: 3},
            {input: 0.00005555, expect: '0.000056', rounding: 3},

            {input: 5.0000000100, expect: '5', rounding: 5},
            {input: 534848975435.5478, expect: '534848975400', rounding: 10},
            {input: 11.11111111111111111, expect: '11.11', rounding: 10},
            {input: 53448.5478, expect: '53448.55', rounding: 10},
        ];
        tests.forEach(test => {
            it(`Input: ${test.input}, Expected: ${test.expect}, Rounding: ${test.rounding}`, () => {
                // Setup
                const config = new Configuration();
                config.display.rounding.setValue(test.rounding);
                const amount = new CurrencyAmount('EUR', test.input, {config: config});

                // Act
                const actual = amount.roundedAmount;

                // Assert
                expect(actual).toEqual(test.expect);
            });
        });
    });
    describe('Converting', () => {
        const tests = [
            {amount: 1, expect: 1, rate: 1},
            {amount: 1, expect: 2, rate: 2},
            {amount: 1, expect: 1.5, rate: 1.5},
            {amount: 1, expect: 0.5, rate: 0.5},
            {amount: 2, expect: 1, rate: 0.5},
            {amount: 1.5, expect: 1, rate: 0.6666666666666666},
            {amount: 0.5, expect: 1, rate: 2},
        ];
        tests.forEach(test => {
            it(`Input: ${test.amount}, Expected: ${test.expect}, Rate: ${test.rate}`, async () => {
                // Setup
                const currencies = new Currencies();
                currencies._rates['AAA'] = {'BBB': new CurrencyRate('AAA', 'BBB', test.rate, Date.now())};
                const original = new CurrencyAmount('AAA', test.amount, {currencies: currencies});

                // Act
                const actual = await original.convertTo('BBB');

                // Assert
                expect(original.amount).toEqual(test.amount);
                expect(original.tag).toEqual('AAA');
                expect(actual.amount).toEqual(test.expect);
                expect(actual.tag).toEqual('BBB');
            });
        });

        it(`Unknown currency`, async () => {
            // Setup
            const browser = new Browser();
            browser.loadLocal = async () => ({});
            browser.background = {
                getRate: async () => {
                    throw 'failure'
                }
            }
            const currencies = new Currencies({browser: browser});
            const original = new CurrencyAmount('UNK', 0, {currencies: currencies});

            // Act
            const actual = await original.convertTo('UNK');

            // Assert
            expect(original.amount).toEqual(0);
            expect(original.tag).toEqual('UNK');
            expect(actual).toEqual(null);
        });
    });


    describe('Display', () => {
        const tests = [
            {rounding: 3, amount: 123, currency: 'UNK', expect: '123 UNK'},
            {rounding: 2, amount: 123, currency: 'UNK', expect: '120 UNK'},
            {rounding: 8, amount: 123.456, currency: 'UNK', expect: '123.46 UNK'},
            {rounding: 8, amount: 123456, currency: 'UNK', expect: '123 456 UNK'},
            {rounding: 8, amount: 123.456, currency: 'UNK', expect: '123,46 UNK', decimal: ','},
            {rounding: 8, amount: 123456, currency: 'UNK', expect: '123.456 UNK', thousands: '.'},
            {rounding: 8, amount: 123456, currency: 'UNK', expect: 'a 123 456 a', using: true, tag: 'a ¤ a'},
            {rounding: 8, amount: 0.25, currency: 'UNK', expect: 'a 0.50 a', using: true, tag: 'a ¤ a', value: 2},
        ];
        tests.forEach(test => {
            it(`Rounding: ${test.rounding}, amount: ${test.amount}, currency: ${test.currency}, expect: ${test.expect}`, async () => {
                // Setup
                const config = new Configuration();
                config.display.rounding.setValue(test.rounding);
                config.display.decimal.setValue(test.decimal);
                config.display.thousands.setValue(test.thousands);
                config.tag.using.setValue(test.using);
                config.tag.value.setValue(test.value);
                config.tag.display.setValue(test.tag)
                const original = new CurrencyAmount(test.currency, test.amount, {config: config});

                // Act
                const actual = original.toString();

                // Assert
                expect(actual).toEqual(test.expect);
            });
        })
    });
});