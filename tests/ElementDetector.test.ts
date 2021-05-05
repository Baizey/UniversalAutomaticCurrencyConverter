import useMockContainer from './Container.mock';
import {BackendApi, IBackendApi} from '../src/CurrencyConverter/BackendApi';
import {BackendApiMock} from './BackendApi.mock';

describe('ElementDetector', () => {
    const create = (html: string): HTMLElement => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.children[0] as HTMLElement;
    }
    const tests = [
        {
            name: 'Amazon one',
            element: create(`<span class="a-price" data-a-size="l" data-a-color="base"><span class="a-offscreen">DKK&nbsp;21.44</span><span aria-hidden="true"><span class="a-price-symbol">DKK</span><span class="a-price-whole">21<span class="a-price-decimal">.</span></span><span class="a-price-fraction">44</span></span></span>`),
            expect: [8]
        },
        {
            name: 'Amazon hidden',
            element: create(`<span class="a-offscreen">DKK&nbsp;21.44</span>`),
            expect: [8]
        },
        {
            name: 'Amazon visible',
            element: create(`<span aria-hidden="true"><span class="a-price-symbol">DKK</span><span class="a-price-whole">21<span class="a-price-decimal">.</span></span><span class="a-price-fraction">44</span></span>`),
            expect: [8]
        }
    ];
    tests.forEach((test: { name: string, element: HTMLElement, expect: any }) => {
        it(`${test.name}`, async () => {
            // Setup
            const [container, provider] = useMockContainer();
            await provider.activeLocalization.load()
            await provider.activeLocalization.overload({dollar: 'USD'})
            const elementDetector = provider.elementDetector;

            // Act
            const actual = elementDetector.find(test.element);


            // Assert
            expect(actual).toEqual(test.expect);
        });
    })
});