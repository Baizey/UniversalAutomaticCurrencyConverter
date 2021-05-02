import useMockContainer from './Container.mock';
import {BackendApi, IBackendApi} from '../src/CurrencyConverter/BackendApi';
import {BackendApiMock} from './BackendApi.mock';
import {CurrencyElement} from '../src/CurrencyConverter/Currency/CurrencyElement';

describe('CurrencyElement', () => {
    const create = (html: string): HTMLElement => {
        const div = document.createElement('div');
        div.innerHTML = html;
        // @ts-ignore
        return div.children[0];
    }
    const tests = [
        {
            name: 'amazon',
            expect: ' 4 USD  ',
            element: create(`<span aria-hidden="true" id="aaa"><span class="a-price-symbol">$</span><span class="a-price-whole">3<span class="a-price-decimal">.</span></span><span class="a-price-fraction">99</span></span>`)
        },
        {
            name: 'aliexpress',
            expect: '280 - 360 USD',
            element: create(`<span class="product-price-value uacc-clickable" itemprop="price" style="" data-spm-anchor-id="a2g0o.detail.1000016.i2.132937d7JS6Tjc">US $282.98 - 361.08</span>`)
        },
        {
            name: 'whitespace', expect: '\n        23 USD\n    ', element: create(`<span id="price_inside_buybox" class="a-size-medium a-color-price" style="">
        22,99&nbsp;€
    </span>`)
        },
        {
            name: 'bracket range',
            expect: '5 - 5 USD (5 - 5 USD)',
            showInBrackets: true,
            element: create(`<div>5 - 5 USD</div>`)
        },
        {
            name: 'bracket negative number',
            expect: '-5 USD (-5 USD)',
            showInBrackets: true,
            element: create(`<div>-5 USD</div>`)
        },
        {
            name: 'bracket negative number',
            expect: '-5 - -5 USD (-5 - -5 USD)',
            showInBrackets: true,
            element: create(`<div>-5 - -5 USD</div>`)
        }

    ];
    tests.forEach((test: { name: string, expect: string, element: HTMLElement, showInBrackets?: boolean }) => {
        it(`${test.name}`, async () => {
            // Setup
            const [container, provider] = useMockContainer()
            container.getRequired<IBackendApi>(BackendApi).override(() => new BackendApiMock({
                USD: {EUR: 1},
                EUR: {USD: 1}
            }, {USD: 'y', EUR: 'y'}))
            await provider.activeLocalization.load()
            await provider.activeLocalization.overload({dollar: 'USD'})
            provider.configurationCurrency.showInBrackets.setValue(test.showInBrackets);
            const actual = new CurrencyElement(provider, test.element)

            // Act
            await actual.convertTo('USD');

            // Assert
            // @ts-ignore
            expect(actual.converted.texts.join(' ')).toEqual(test.expect)
        });
    })
});