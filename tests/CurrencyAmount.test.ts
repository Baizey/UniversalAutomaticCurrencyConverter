import {Container} from "../src/Infrastructure";
import {CurrencyAmount} from "../src/CurrencyConverter/Currency/CurrencyAmount";
import {BackendApiMock} from "./BackendApi.mock";

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
        tests.forEach((test: { input: number, expect: string | string[], rounding: number }) => {
            it(`Input: ${test.input}, Expected: ${test.expect}, Rounding: ${test.rounding}`, () => {
                // Setup
                const container = Container.mock().build()
                container.configuration.display.rounding.setValue(test.rounding);
                const amount = new CurrencyAmount('EUR', test.input, container.configuration, container.backendApi);

                // Act
                const actual = amount.roundedAmount;

                // Assert
                if (!Array.isArray(test.expect)) test.expect = [test.expect]
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
        tests.forEach((test: { amount: number | number[], expect: number | number[], rate: number }) => {
            it(`Input: ${test.amount}, Expected: ${test.expect}, Rate: ${test.rate}`, async () => {
                // Setup
                const container = Container.mock()
                container.backendApi.override(() => new BackendApiMock({'AAA': {'BBB': test.rate}}))
                const build = container.build()
                const original = new CurrencyAmount('AAA', test.amount, build.configuration, build.backendApi);

                // Act
                const actual = await original.convertTo('BBB');


                // Assert
                expect(actual).not.toBeNull()
                if (!actual) return;
                if (!Array.isArray(test.amount)) test.amount = [test.amount]
                expect(original.amount).toEqual(test.amount);
                expect(original.tag).toEqual('AAA');
                if (!Array.isArray(test.expect)) test.expect = [test.expect]
                expect(actual.amount).toEqual(test.expect);
                expect(actual.tag).toEqual('BBB');
            });
        });

        it(`Unknown currency`, async () => {
            // Setup
            const container = Container.mock()
            const build = container.build()
            const original = new CurrencyAmount('UNK', 0, build.configuration, build.backendApi);

            // Act
            const actual = await original.convertTo('UNK4');

            // Assert
            expect(original.amount).toEqual([0]);
            expect(original.tag).toEqual('UNK');
            expect(actual).toEqual(null);
        });
    });
    describe('Display', () => {
        const tests = [
            {rounding: 1, amount: 0.099, currency: 'UNK', expect: '0.10 UNK'},
            {rounding: 1, amount: 0.99, currency: 'UNK', expect: '1.0 UNK'},
            {rounding: 2, amount: 0.0999, currency: 'UNK', expect: '0.100 UNK'},
            {rounding: 2, amount: 0.999, currency: 'UNK', expect: '1.00 UNK'},
            {rounding: 2, amount: 3.99, currency: 'UNK', expect: '4 UNK'},
            {rounding: 3, amount: 123, currency: 'UNK', expect: '123 UNK'},
            {rounding: 2, amount: 123, currency: 'UNK', expect: '120 UNK'},
            {rounding: 8, amount: 123.456, currency: 'UNK', expect: '123.46 UNK'},
            {rounding: 8, amount: 123456, currency: 'UNK', expect: '123 456 UNK'},
            {rounding: 8, amount: 123.456, currency: 'UNK', expect: '123,46 UNK', decimal: ','},
            {rounding: 8, amount: 123456, currency: 'UNK', expect: '123.456 UNK', thousands: '.'},
            {rounding: 8, amount: 123456, currency: 'UNK', expect: 'a 123 456 a', using: true, tag: 'a ¤ a'},
            {rounding: 8, amount: 0.25, currency: 'UNK', expect: 'a 0.50 a', using: true, tag: 'a ¤ a', value: 2},
        ];
        tests.forEach((test: {
            using?: boolean
            rounding?: number
            amount: number
            currency: string
            expect: string
            decimal?: string
            thousands?: string
            tag?: string
            value?: number
        }) => {
            it(`Rounding: ${test.rounding}, amount: ${test.amount}, currency: ${test.currency}, expect: ${test.expect}`, async () => {
                // Setup
                const container = Container.mock()
                const build = container.build()
                build.configurationDisplay.rounding.setValue(test.rounding)
                build.configurationDisplay.decimal.setValue(test.decimal)
                build.configurationDisplay.thousands.setValue(test.thousands)

                build.configurationTag.using.setValue(test.using)
                build.configurationTag.value.setValue(test.value)
                build.configurationTag.display.setValue(test.tag)

                const original = new CurrencyAmount(test.currency, test.amount, build.configuration, build.backendApi);

                // Act
                const actual = original.toString();

                // Assert
                expect(actual).toEqual(test.expect);
            });
        })
    });
});