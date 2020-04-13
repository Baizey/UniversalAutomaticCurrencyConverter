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

});